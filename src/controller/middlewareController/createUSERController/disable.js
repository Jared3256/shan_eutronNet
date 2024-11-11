const asyncHandler = require("express-async-handler");

const disable = asyncHandler(async (User, req, res) => {
  let updates = {
    enabled: false,
  };

  // Check the length of the Id
  if (String(req.params.id).length !== 24) {
    return res.status(417).json({
      success: false,
      result: null,
      message: "id length is not allowed",
    });
  }
  try {
    // Find the document by id and delete it
    const user = await User.findOne({
      _id: req.params.id,
      removed: false,
    }).exec();

    if (!user) {
      return res.status(417).json({
        success: false,
        result: null,
        message: "No User found",
      });
    }

    if (user.role === "admin" || user.role === "owner") {
      return res.status(403).json({
        success: false,
        result: null,
        message: "can't disable a user with role 'admin'",
      });
    }
  } catch (error) {
    return res.status(417).json({
      success: false,
      result: null,
      message: "No User found",
    });
  }

  // Find the document by id and delete it
  const result = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();
 
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: "No user found",
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: "Successfully disabled user",
    });
  }
});

module.exports = disable;
