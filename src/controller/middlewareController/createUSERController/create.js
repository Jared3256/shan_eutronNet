const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generate: uniqueId } = require("shortid");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// import user password model
const UserPassword = require("../../../models/coreModels/UserPassword");
const { generateVerificationToken } = require("../../../utils/system.utils");
const { sendVerificationEmail } = require("../../../utils/mailtrap/email");

const create = asyncHandler(async (User, req, res) => {
  let { email, password, enabled, name, surname, role } = req.body;

  enabled = false;
  if (!name) {
    return res.status(400).json({
      success: false,
      result: null,
      message: "name is not provided",
    });
  }
  if (!email || !password)
    return res.status(400).json({
      success: false,
      result: null,
      message: "Email or password fields is empty",
    });

  if (req.body.role === "owner") {
    return res.status(403).send({
      success: false,
      result: null,
      message: "you can't create user with role owner",
    });
  }

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser)
    return res.status(400).json({
      success: false,
      result: null,
      message: "An account with this email already exists.",
    });

  if (password.length < 8)
    return res.status(400).json({
      success: false,
      result: null,
      message: "The password needs to be at least 8 characters long.",
    });

  const salt = uniqueId();

  const passwordHash = bcrypt.hashSync(salt + password);

  req.body.removed = false;

  const result = await new User({
    email,
    enabled,
    name,
    surname,
    role,
  }).save();

  if (!result) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "document couldn't save correctly",
    });
  }
  const verificationToken = generateVerificationToken();
  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
    user: result._id,
    emailVerified: false,
    emailToken: verificationToken,
  };
  const resultPassword = await new UserPassword(UserPasswordData).save();

  if (!resultPassword) {
    await User.deleteOne({ _id: result._id }).exec();

    return res.status(403).json({
      success: false,
      result: null,
      message: "couldn't save user correctly",
    });
  }

  // Generate and set token cookies

  const accessToken = jwt.sign(
    {
      UserInfo: {
        removed: result.removed,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        created: result.created,
        role: result.role,
        bio: result.bio,
        timezone: result.timezone,
        year_leave: result.year_leave,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30min",
    }
  );

  const refreshToken = jwt.sign(
    {
      UserInfo: {
        removed: result.removed,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        created: result.created,
        role: result.role,
        bio: result.bio,
        timezone: result.timezone,
        year_leave: result.year_leave,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );

  // create secure cookie with refresh token
  res.cookie("SDS_Token", refreshToken, {
    http: true,
    secure: true,
    sameSite: "strict",
    maxAge: 12 * 60 * 60 * 1000, //12 hour maximum time to live,
  });

  // Send verification email
  //   await sendVerificationEmail(email, verificationToken);
  return res.status(200).send({
    success: true,
    accessToken,
    message: "User document saved successfully",
  });
});
module.exports = create;
