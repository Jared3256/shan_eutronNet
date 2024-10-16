const express = require("express");
const {
  createUser,
  netLogin,
  netUpdateUser,
  listAllUsers,
} = require("../../controller/net/netUserController");

// Import the netUserController

const router = express.Router();

// create user Endpoint
// Method POST
router.route("/auth/create").post(createUser);

// Login User Endpoint
// Method POST
router.route("/auth/login").post(netLogin);

// Update user details Endpoint
// Method PUT
router.route("/api/update").put(netUpdateUser);


// List all users
// Method GET
router.route("/auth/api/users/listAll").get(listAllUsers);

module.exports = router;
