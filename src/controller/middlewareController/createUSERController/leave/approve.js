const asyncHandler = require("express-async-handler");
const { differenceInBusinessDays } = require("date-fns");
const UserLeave = require("../../../../models/app/UserLeave");

const approve = asyncHandler(async (User, req, res) => {
  // Get the Id from the params
 
  const { id } = req.params;
  const { approval } = req.body;

  if (String(id).length !== 24) {
    return res.status(406).json({
      message: "id format mismatch",
      success: false,
    });
  }

  if (!approval) {
    return res.status(406).json({
      message: "critical value is missing",
      success: false,
    });
  }
  if (
    approval !== "denied" &&
    approval !== "approved" &&
    approval !== "cancelled"
  ) {
    return res.status(406).json({
      message: "approval value is not accepted",
      success: false,
    });
  }
  try {
    const foundRequest = await UserLeave.findById(id);
    
    
    if (!foundRequest) {
      return res.status(417).json({
        message: "id does not match any request",
        success: false,
      });
    }

    if (approval === "approved" || approval === "denied") {
      foundRequest.isDraggable = true;
    } else {
      foundRequest.isDraggable = false;
    }

    // Restore the leave balance with applied date
    if (
      approval === "denied" &&
      (foundRequest.approval !== "denied" || foundRequest.approval !== "cancelled")
    ) {
      const difference = Math.abs(
        differenceInBusinessDays(foundRequest.start, foundRequest.end)
      );
      const relatedUser = await User.findById(foundRequest.user);

      relatedUser.year_leave = relatedUser.year_leave + difference;
      console.log("Days", relatedUser.year_leave + difference);
      await relatedUser.save();
    }

    foundRequest.approval = approval;

    await foundRequest.save();
    return res.status(200).json({
      message: `request successfully updated to ${approval}`,
      success: false,
    });
  } catch (error) {
    return res.status(417).json({
      message: "id does not match any request",
      success: false,
    });
  }
});
module.exports = approve;
