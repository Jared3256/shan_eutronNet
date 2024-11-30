const asyncHandler = require("express-async-handler");
// Import the UserLeave Model
const UserLeave = require("../../../../models/app/UserLeave");

const listAll = asyncHandler(async (req, res) => {
  const leaveList = await UserLeave.find({});

  if (leaveList.length < 1) {
    return res.status(404).json({
      message: "no leave available at the moment",
      success: false,
    });
  }

  return res.status(200).json({
    message: "found all the request",
    success: true,
    result: leaveList,
  });
});

module.exports = listAll;
