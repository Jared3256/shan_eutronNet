const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserPassword = require("../../../models/coreModels/UserPassword");

const logout = asyncHandler(async (User, req, res) => {
  const cookies = req.cookies;
  const token = cookies?.SDS_Token;
  if (!token) {
    return res.status(401).json({ message: "Problem logging out" });
  }

  const decoded = jwt.decode(cookies.SDS_Token);

  if (!decoded) {
    return res.status(401).json({ message: "Problem logging out" });
  }

  const user_id = decoded.id;

  await UserPassword.findOneAndUpdate(
    { user: user_id },
    { $pull: { loggedSessions: token } },
    {
      new: true,
    }
  ).exec();

  res.clearCookie("SDS_Token", {
    maxAge: null,
    sameSite: null,
    httpOnly: null,
    secure: null,
    domain: null,
    Path: undefined,
  });

  res.json({
    success: true,
    result: {},
    message: "Successfully logout",
  });
});

module.exports = logout;
