const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const refresh = asyncHandler(async (User, req, res) => {
  const cookies = req.cookies;
  if (!cookies?.SDS_Token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.SDS_Token;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorised Token" });

      const foundUser = await User.findOne({ email: decoded.UserInfo.email });

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
            removed: foundUser.removed,
            enabled: foundUser.enabled,
            email: foundUser.email,
            name: foundUser.name,
            surname: foundUser.surname,
            photo: foundUser.photo,
            created: foundUser.created,
            role: foundUser.role,
            bio: foundUser.bio,
            timezone: foundUser.timezone,
            year_leave: foundUser.year_leave,
            active_role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30min",
        }
      );
      res.json({ accessToken });
    })
  );
});

module.exports = refresh;
