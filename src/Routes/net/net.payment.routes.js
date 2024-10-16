const { createPayment } = require("../../controller/net/netPaymentController")

// Import the router from express package
const router = require("express").Router()

// create payment Endpoint
// Method POST
router.route("/create").post(createPayment)
module.exports = router