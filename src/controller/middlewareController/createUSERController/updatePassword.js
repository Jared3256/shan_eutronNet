const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const UserPassword = require("../../../models/coreModels/UserPassword");
const { generate: uniqueId } = require("shortid");
const updatePassword = asyncHandler(async (User, req, res) => {
 
  const userProfile = req.params.id;

  if (userProfile.length !== 24) {
    return res.status(417).json({
      message: "Id length is not accepted",
      success: false,
      result: null,
    });
  }
  let { password } = req.body;

  console.log(password === undefined);
  if (password ===undefined || String(password).length < 8)
    return res.status(400).json({
      message: "The password needs to be at least 8 characters long.",
    });

  // Find document by id and updates with the required fields

  const salt = uniqueId();

  const passwordHash = bcrypt.hashSync(salt + password);

  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
  };

  const resultPassword = await UserPassword.findOneAndUpdate(
    { user: req.params.id, removed: false },
    { $set: UserPasswordData },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  // Code to handle the successful response

  if (!resultPassword) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "User Password couldn't save correctly",
    });
  }

  return res.status(200).json({
    success: true,
    result: {},
    message: "password by this id: " + userProfile + " updated successfully",
  });
});

module.exports = updatePassword;
