const { createSession } = require("../../controller/net/netSessionsController");

const router = require("express").Router();

router.route("/create").post(createSession)

module.exports = router;
