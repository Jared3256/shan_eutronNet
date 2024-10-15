const { createSession, removeSession, updateSession, endSession } = require("../../controller/net/netSessionsController");

const router = require("express").Router();

// Endpoint to create session
// Method POST

router.route("/create").post(createSession)

// Endpoint to remove session
// Method DELETE
router.route("/delete/:id").delete(removeSession)


// Endpoint to update the sessions
// Method PUT
router.route("/:id/update").put(updateSession)

// Endpoint to end session
// Method POST
router.route("/:id/end").post(endSession)
module.exports = router;
