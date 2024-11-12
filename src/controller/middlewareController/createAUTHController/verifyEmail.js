const asyncHandler = require("express-async-handler");

// Import the user password model
const UserPassword = require("../../../models/coreModels/UserPassword");
const { sendWelcomeEmail } = require("../../../utils/mailtrap/email");
const { generateResetToken } = require("../../../utils/system.utils");
const verifyEmail = asyncHandler(async (User, req, res) => {
  const { code } = req.body;

  try {
    const userPasswordModel = await UserPassword.findOne({
      emailToken: code,
      emailTokenExpiresAt: { $gt: Date.now() },
    });

    if (!userPasswordModel) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification Token.",
      });
    }

    userPasswordModel.emailToken = null;
    userPasswordModel.emailTokenExpiresAt = null;
    userPasswordModel.emailVerified = true
    await userPasswordModel.save();

    //   Get the user and activate their account
    const user = await User.findById(userPasswordModel.user);

    user.enabled = true;

    await user.save();

    // send welcome email to the user
    // await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      message:"email verified successfully", success:true
    })
  } catch (error) {
    console.log(error)
    return res.status(417).json({
      message: "error verifying account.",
      success: false,
    });
  }
});

module.exports = verifyEmail;
