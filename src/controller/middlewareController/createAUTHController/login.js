const asyncHandler = require("express-async-handler");
const authUser = require("./authUser");
const UserPasswordModel = require("../../../models/coreModels/UserPassword");
const Joi = require("joi");

const login = asyncHandler(async (User, req, res) => {
  const { email, password } = req.body;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: "Invalid/Missing credentials.",
      errorMessage: error.message,
    });
  }

  const user = await User.findOne({ email: email, removed: false });

  // console.log(user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: "No account with this email has been registered.",
    });

  const databasePassword = await UserPasswordModel.findOne({
    user: user._id,
    removed: false,
  });

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: "Your account is disabled, contact your account administrator",
    });

  //  authUser if your has correct password
  authUser(req, res, { user, databasePassword, password, UserPasswordModel });
});

module.exports = login;
