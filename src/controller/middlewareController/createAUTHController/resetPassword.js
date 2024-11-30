const asyncHandler = require("express-async-handler");
const UserPassword = require("../../../models/coreModels/UserPassword");
const { sendResetSuccessEmail } = require("../../../utils/mailtrap/email");
const { generate: uniqueId } = require("shortid");
const bcrypt = require("bcryptjs")

const resetPassword = asyncHandler(async (User, req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  const userPasswordModel = await UserPassword.findOne({
    resetToken: token,
    resetTokenExpiresAt: {
      $gt: Date.now(),
    },
  });

  if (!userPasswordModel) {
  return res.status(400).json({
    message: "iInvalid or expired Token",
  });
  }
  // Update the password
  if (password === undefined || String(password).length < 8)
    return res.status(400).json({
      message: "The password needs to be at least 8 characters long.",
    });

  const salt = uniqueId();
  const passwordHash = bcrypt.hashSync(salt + password);
  
  userPasswordModel.password = passwordHash;
  userPasswordModel.salt = salt;
  userPasswordModel.resetToken = null;
  userPasswordModel.resetTokenExpiresAt = null;

  await userPasswordModel.save();
  const user = await User.findById(userPasswordModel.user);
  // await sendResetSuccessEmail(user.email);

  return res.status(200).json({ message: "Password reset successful" });
});

module.exports = resetPassword;
