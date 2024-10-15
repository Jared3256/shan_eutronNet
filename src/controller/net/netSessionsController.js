const asyncHandler = require("express-async-handler");

// Import the User  Model
const userModel = require("../../models/net/user.net");

// Import the router Model
const routerModel = require("../../models/net/router.net");

// import the vendor model
const vendorModel = require("../../models/net/vendor.net");

// import the sessions Model
const sessionModel = require("../../models/net/session.net");

// Import Mongoose package
const mongoose = require("mongoose");

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
    foundRouter = await routerModel.findById(routerId).select("-rootPassword");
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

// Function to delete sessions
// Access Private
// Endpoint /net/api/sessions/delete
const removeSession = asyncHandler(async (req, res) => {
  return res
    .status(405)
    .json({ message: "cannot remove session once created", success: false });
});

// Function to update the session
// Access Public / Private
// Endpoint /net/api/sessions/sessionId/update
const updateSession = asyncHandler(async (req, res) => {
  // Get the session Id from the request
  const { id } = req.params;

  const { dataUsed, amountBilled } = req.body;

  // Check if the sessionId id is equal to 24
  if (String(id).length !== 24) {
    return res
      .status(417)
      .json({ message: "Session Id format mismatching", success: false });
  }

  // Find the Session from the database
  try {
    const foundSession = await sessionModel.findById(id);
    if (!foundSession) {
      return res
        .status(417)
        .json({ message: "Id provided does not match any session" });
    }

    // Update the session
    foundSession.dataUsed = dataUsed;
    foundSession.amountBilled = amountBilled;

    await foundSession.save();

    // find the router with the session and update
    const Routers = await routerModel.find({});
    const correctRouter = Routers.filter((router) => {
      const sessions = router.sessions;

      const correctSession = sessions.filter((session) => {
      
        const sess = { ...session.__parentArray };
        console.log("🚀 ~ correctSession ~ path:", 
         sess.sessionId
        );
        
        session.sessionId === id;
      });

      if (correctSession.length) {
        console.log("🚀 ~ correctRouter ~ correctSession:", correctSession);
        return router;
      }
    });
    return res.status(200).json({ message: "Session update successfully" });
  } catch (error) {
    console.log("🚀 ~ updateSession ~ error:", error);
    return res
      .status(417)
      .json({ message: "Id provided does not match any session" });
  }
});
module.exports = {
  createSession,
  removeSession,
  updateSession,
};
