// import the async handler from the express
const asyncHandler = require("express-async-handler");

// import the payment Model
const paymentModel = require("../../models/net/paymet.net");

// import the user model
const userModel = require("../../models/net/user.net");

// import the vendor model
const vendorModel = require("../../models/net/vendor.net");

// import the session model
const sessionModel = require("../../models/net/session.net");

// import the mongoose package
const mongoose = require("mongoose");

// Function to create new payments
// Access Private
// Endpoint /net/api/payment/create
const createPayment = asyncHandler(async (req, res) => {
  let user;
  let vendor;
  // Get the payment details from the body
  const { userId, vendorId, sessionId, amount } = req.body;

  // Check availability of the key payment details
  if (!userId || !vendorId || !sessionId || !amount) {
    return res.status(400).json({ message: "Critical information is missing" });
  }

  // Check the length of the vendorId
  if (String(userId).length !== 24) {
    return res.status(417).json({ message: "User id format mismatching" });
  }
  // Check the length of the userId
  if (String(vendorId).length !== 24) {
    return res.status(417).json({ message: "Vendor id format mismatching" });
  }
  // Check the length of th sessionId
  if (String(sessionId).length !== 24) {
    return res.status(417).json({ message: "Session id format mismatching" });
  }

  // Check if userId matches any user
  try {
    user = await userModel.findById(userId);

    if (!user) {
      return res.status(417).json({ message: "Id does not match any user" });
    }
  } catch (error) {
    return res.status(417).json({ message: "Id does not match any user" });
  }
  // Check if vendorId matches any vendor
  try {
    vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(417).json({ message: "Id does not match any vendor" });
    }
  } catch (error) {
    return res.status(417).json({ message: "Id does not match any vendor" });
  }
  // Check if sessionId matches any session
  try {
    const session = await sessionModel.findById(sessionId);

    if (!session) {
      return res.status(417).json({ message: "Id does not match any session" });
    }
  } catch (error) {
    return res.status(417).json({ message: "Id does not match any session" });
  }
  // Create the payment model
  const payment = new paymentModel({
    userId,
    vendorId,
    sessionId,
    amount,
  });

  // await payment.save();

  // Inject the payment to the user model
  user.paymentHistory = [...user.paymentHistory, payment];
  await user.save();

  // Update the vendor Id
  vendor.totalRevenue = Number(vendor.totalRevenue) + Number(amount);

  await vendor.save();
  return res.status(200).json({
    message: "Payment was successful",
    success: true,
    payment: { ...payment._doc },
    user,
    vendor,
  });
});

// Function to delete payment
// Access Private
// Endpoint /net/api/payment/paymentId/delete
const deletePayment = asyncHandler(async (req, res) => {
  return res
    .status(405)
    .json({ message: "cannot remove payment after posting", success: false });
});

// Function to update payment
// Access Private
// Endpoint /net/api/payment/paymentId/update
const updatePayment = asyncHandler(async (req, res) => {});

// Function to list All payments
// Access Private
// Endpoint /net/api/payment/list
const listAllPayment = asyncHandler(async (req, res) => {
  // Find all the payment
  const payments = await paymentModel.find({});

  if (payments.length < 1) {
    return res
      .status(404)
      .json({ message: "no payment found.", success: true });
  }

  return res
    .status(200)
    .json({ message: "payments found success", payments, success: true });
});

// Function to summarise the payment
// Access Private
// Endpoint /net/api/payment/summary/userId
const paymentSummary = asyncHandler(async (req, res) => {
  // Get the vendor Id from the request query
  const {id:vendorId} = req.params

  // 
});

// Function to filter payments
// Access Private
// Endpoint /net/api/payment/filter
const filterPayment = asyncHandler(async (req, res) => {
  const paymentMethod = req.query.paymentMethod || "Mpesa_AirtelMoney";
  const paymentStatus = req.query.paymentStatus || "initiated";
  const vendorId = req.query.vendorId || undefined;

  // Check the length of the vendorId incase its provided
  if (vendorId) {
    if (String(vendorId).length !== 24) {
      return res.status(417).json({ message: "vendor Id format mismatching" });
    }
  }

  // Check the value passed as payment method

  if (
    !(
      paymentMethod === "Mpesa_AirtelMoney" ||
      paymentMethod === "PayPal" ||
      paymentMethod === "CreditCard" ||
      paymentMethod === "BankTransfer"
    )
  ) {
    return res
      .status(405)
      .json({ message: "payment method is not supported", success: false });
  }
  // Check the value passed as payment status
  if (
    !(
      paymentStatus === "initiated" ||
      paymentStatus === "pending" ||
      paymentStatus === "completed" ||
      paymentStatus === "refunded"
    )
  ) {
    return res
      .status(405)
      .json({ message: "payment status is not supported", success: false });
  }

  const payments = await paymentModel.find({
    paymentStatus,
    paymentMethod,
  });

  // declare filtered payments variable
  let filteredPayments = payments;
  if (vendorId) {
    filteredPayments = filteredPayments.filter((payment) => {
      if (new mongoose.Types.ObjectId(vendorId).equals(payment.vendorId)) {
        return payment;
      }
    });
  }

  if (filteredPayments.length < 1) {
    return res
      .status(417)
      .json({ message: "no payment matches search criteria" });
  }
  return res.status(200).json({
    message: "payment filtered",
    success: true,
    payment: {
      ...filteredPayments,
    },
  });
});

module.exports = {
  createPayment,
  deletePayment,
  updatePayment,
  updatePayment,
  listAllPayment,
  paymentSummary,
  filterPayment,
};
