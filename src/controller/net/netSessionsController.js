const asyncHandler = require("express-async-handler");

// Import the User  Model
const userModel = require("../../models/net/user.net");

// Import the router Model
const routerModel = require("../../models/net/router.net");

// import the vendor model
const vendorModel = require("../../models/net/vendor.net");

// import the sessions Model
const sessionModel = require("../../models/net/session.net");

// Function to create new sessions
// Access Public
// Endpoint /net/api/sessions/create
const createSession = asyncHandler(async (req, res) => {
    let foundRouter;
  // Get the details from the request body
  const { userId, vendorId, routerId } = req.body;

  if (!userId || !vendorId || !routerId) {
    return res.status(400).json({
      message: "Critical information missing. Check User, Vendor or router",
    });
  }

  // Check the length of the the Ids passed
  if (String(userId).length !== 24) {
    return res.status(417).json({
      message: "User Id format mismatch",
    });
  }
  if (String(vendorId).length !== 24) {
    return res.status(417).json({
      message: "Vendor Id format mismatch",
    });
  }
  if (String(routerId).length !== 24) {
    return res.status(417).json({
      message: "Router Id format mismatch",
    });
  }

  // Check if there is user with the userId
  try {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      return res.status(417).json({ message: "No user linked to the Id" });
    }
  } catch (error) {
    return res.status(417).json({ message: "No user linked to the Id" });
  }

  // Check if there is router with the routerId
  try {
     foundRouter = await routerModel
      .findById(routerId)
      .select("-rootPassword");
    if (!foundRouter) {
      return res.status(417).json({ message: "No router linked to the Id" });
    }
  } catch (error) {
    return res.status(417).json({ message: "No router linked to the Id" });
  }

    // Check if there is vendor with the vendorId
    try {
        const foundVendor = await vendorModel.findById(vendorId);
  if (!foundVendor) {
    return res.status(417).json({ message: "No vendor linked to the Id" });
  }
    } catch (error) {
        return res.status(417).json({ message: "No vendor linked to the Id" });
    }
  

  // Create the new sessions
  const newSession = new sessionModel({ userId, vendorId, routerId });
  await newSession.save();

  // Update the routers sessions
  foundRouter.sessions = [
    ...foundRouter.sessions,
    { sessionId: newSession._doc._id, startTime: newSession._doc.startTime },
  ];

  await foundRouter.save();
  return res.status(200).json({
    message: "Successfully created session",
    newSession,
    success: true,
  });
});

module.exports = {
  createSession,
};
