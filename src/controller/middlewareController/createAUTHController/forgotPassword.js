const asyncHandler = require("express-async-handler");
const UserPassword = require("../../../models/coreModels/UserPassword");
const { sendPasswordResetEmail } = require("../../../utils/mailtrap/email");
const { generateResetToken } = require("../../../utils/system.utils");

const forgotPassword = asyncHandler(async (User, req, res) => {
  const { email } = req.body;
console.log(email)
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email [${email}] is not registered` });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    const passwordModel = await UserPassword.findOne({
      user: user._id,
    });

    passwordModel.resetToken = resetToken;
    passwordModel.resetTokenExpiresAt = resetTokenExpiry;

    await passwordModel.save();

    // send email
    const link = `http://localhost:5173/api/auth/reset_password/${resetToken}`;
    console.log(link);
    await sendPasswordResetEmail(email, link);

    return res.status(200).json({
      message: "check your email for reset token",
    });
  } catch (error) {
    console.log(error)
  }
});

module.exports = forgotPassword;
