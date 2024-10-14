const {
  createRouter,
  listRouter,
  listAllRouters,
  deleteRouter,
  updateRouter,
  activateDeactivateRouter,
  createRouterSessions,
} = require("../../controller/net/netRouterController");

// Import express and destructure the router
const router = require("express").Router();

// create router Endpoint
// Method POST
router.route("/create").post(createRouter);

// List router by vendorId
// Method GET
router.route("/list/:id").get(listRouter);

// List All routers
// Method GET
router.route("/listAll").get(listAllRouters);

// Delete Router
// Method DELETE
router.route("/delete/:id").delete(deleteRouter);

// Update Router
// Method PUT
router.route("/update/:id").put(updateRouter)

// Update Router
// Method PATCH
router.route("/toggle/:id").patch(activateDeactivateRouter)

// update Router
// Method PATCH
router.route("/:id/sessions").patch(createRouterSessions)

module.exports = router;
