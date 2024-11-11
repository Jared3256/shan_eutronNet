const express = require("express");
const {
  signup,
  login,
  logout,
  verifyemail,
  forgotPassword,
  resetpassword,
} = require("../../controller/advancedAuthController");
const createUserController = require("../../controller/middlewareController/createUSERController");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify_email", verifyemail);

router.post("/forgot_password", forgotPassword);

router.post("/reset_password/:token", resetpassword);

//  Routes for the Core User Model // 
router.route("/admin/create").post(createUserController.create)
module.exports = router;
