const { createSession, removeSession } = require("../../controller/net/netSessionsController");

const router = require("express").Router();

// Endpoint to create session
// Method POST

router.route("/create").post(createSession)

// Endpoint to remove session
router.route("/delete/:id").delete(removeSession)

module.exports = router;
