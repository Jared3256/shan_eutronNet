const { createSession, removeSession, updateSession } = require("../../controller/net/netSessionsController");

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
module.exports = router;
