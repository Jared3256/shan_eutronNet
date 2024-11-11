const asyncHandler = require("express-async-handler");

const { generate: uniqueId } = require("shortid");

const remove = async (User, req, res) => {
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
    if (user.role === "owner") {
      return res.status(403).json({
        success: false,
        result: null,
        message: "can't remove a user with role 'owner'",
      });
    }

    let updates = {
        removed: true,
        enabled:false,
      email: "removed+" + uniqueId() + "+" + user.email,
    };

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
        message: "No document found ",
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: "Successfully Deleted user document ",
      });
    }
  } catch (error) {
    return res.status(417).json({
      success: false,
      result: null,
      message: "No User found",
    });
  }
};

module.exports = remove;
