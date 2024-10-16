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
  await user.save()

  // Update the vendor Id
  vendor.totalRevenue = Number(vendor.totalRevenue) + Number(amount);
 
  await vendor.save()
  return res
    .status(200)
    .json({
      message: "Payment was successful",
      success: true,
      payment: { ...payment._doc },user,vendor
    });
});

module.exports = {
  createPayment,
};
