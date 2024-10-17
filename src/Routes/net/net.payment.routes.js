const { createPayment, deletePayment, updatePayment, listAllPayment, paymentSummary } = require("../../controller/net/netPaymentController")

// Import the router from express package
const router = require("express").Router()

// create payment Endpoint
// Method POST
router.route("/create").post(createPayment)

// delete payment Endpoint
// Method DELETE
router.route("/:id/delete").delete(deletePayment)

// update payment Endpoint
// Method PUT
router.route("/:id/update").put(updatePayment)

// list all payment endpoint
// Method GET
router.route("/listAll").get(listAllPayment)


// payment summary endpoint
// Method GET
router.route("/summary/:id").get(paymentSummary)

module.exports = router