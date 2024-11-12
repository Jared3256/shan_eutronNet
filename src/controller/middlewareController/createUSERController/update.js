// Import express async handler
const asyncHandler = require("express-async-handler");

const update = asyncHandler(async (User, req, res) => {
  const reqUserName = "coreuser".toLowerCase();
  let { email, enabled, name, photo, surname, role } = req.body;

  // Get the user Id from the query params
  const { id } = req.params;

  // Check the length of the id
  if (String(id).length !== 24) {
    return res.status(409).json({
      message: "id length is not accepted",
      success: false,
      result: null,
    });
  }
  if (role === "owner") {
    return res.status(403).send({
      success: false,
      result: null,
      message: "you can't update user with role owner",
    });
  }

  try {
    const tmpResult = await User.findOne({
      _id: id,
      removed: false,
    }).exec();

    console.log(tmpResult);
    if (!tmpResult) {
      return res.status(417).json({
        message: "no user matches the id",
        success: false,
        result: null,
      });
    }

    if (
      role === "owner" ||
      (req[reqUserName].role === "owner" &&
        tmpResult._id.toString() !== req[reqUserName]._id.toString())
    ) {
      return res.status(403).send({
        success: false,
        result: null,
        message: "you can't update other users with role owner",
      });
    }

    let updates = {};

    if (
      req[reqUserName].role === "owner" &&
      tmpResult._id.toString() === req[reqUserName]._id.toString()
    ) {
      updates = { email, photo, name, surname };
    } else if (
      req[reqUserName].role === "admin" &&
      tmpResult._id.toString() === req[reqUserName]._id.toString()
    ) {
      updates = { email, photo, name, surname };
    } else {
      updates = { role, email, photo, enabled, name, surname };
    }

    // Find document by id and updates with the required fields
    const result = await User.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No user document found ",
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        role: result.role,
      },
      message: "user document updated successfully",
    });
  } catch (error) {
    return res.status(417).json({
      message: "no user matches the id o",
      success: false,
      result: null,
    });
  }
});

module.exports = update;
