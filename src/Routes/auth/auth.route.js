const express = require("express");
const createUserController = require("../../controller/middlewareController/createUSERController");
const createAUTHController = require("../../controller/middlewareController/createAUTHController");
const loginLimiter = require("../../middleware/loginLimiter");

const router = express.Router();

router.post("/login/v1", loginLimiter, createAUTHController.login);

router.get("/refresh/v1", createAUTHController.refresh);

router.post("/logout/v1", createAUTHController.logout);

router.post("/verify_email/v1", createAUTHController.verifyEmail);

router.post("/forgot_password/v1", createAUTHController.forgotPassword);

router.post("/reset_password/:token/v1", createAUTHController.resetPassword);

// // __________________  Routes for the Core User Model ___________________  // //
router.route("/admin/create").post(createUserController.create);
router.route("/admin/disable/:id").post(createUserController.disable);
router.route("/admin/listAll").get(createUserController.listAll);
router.route("/admin/list").get(createUserController.paginatedList);
router.route("/admin/filter").get(createUserController.filter);
router.route("/admin/remove/:id").delete(createUserController.remove);
router.route("/admin/update/:id").put(createUserController.update);
router
  .route("/admin/password/update/:id")
  .put(createUserController.updatePassword);
module.exports = router;
