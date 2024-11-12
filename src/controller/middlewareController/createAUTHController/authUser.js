const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authUser = asyncHandler(
  async (req, res, { user, databasePassword, password, UserPasswordModel }) => {
    const isMatch = await bcrypt.compare(
      databasePassword.salt + password,
      databasePassword.password
    );

    if (!isMatch)
      return res.status(403).json({
        success: false,
        result: null,
        message: "Invalid credentials.",
      });

    if (isMatch === true) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: user._id,
            removed: user.removed,
            enabled: user.enabled,
            email: user.email,
            name: user.name,
            surname: user.surname,
            photo: user.photo,
            created: user.created,
            role: user.role,
            bio: user.bio,
            timezone: user.timezone,
            year_leave: user.year_leave,
            active_role: user.role,
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
            id: user._id,
            removed: user.removed,
            enabled: user.enabled,
            email: user.email,
            name: user.name,
            surname: user.surname,
            photo: user.photo,
            created: user.created,
            role: user.role,
            bio: user.bio,
            timezone: user.timezone,
            year_leave: user.year_leave,
            active_role: user.role,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );

      await UserPasswordModel.findOneAndUpdate(
        { user: user._id },
        { $push: { loggedSessions: refreshToken } },
        {
          new: true,
        }
      ).exec();

      res
        .status(200)
        .cookie("SDS_Token", refreshToken, {
          maxAge: 12 * 60 * 60 * 1000,
          sameSite: "Lax",
          httpOnly: true,
          secure: false,
          domain: req.hostname,
          path: "/",
          Partitioned: true,
        })
        .json({
          success: true,
          accessToken,
          message: "Successfully login user",
        });
    } else {
      return res.status(403).json({
        success: false,
        result: null,
        message: "Invalid credentials.",
      });
    }
  }
);

module.exports = authUser;
