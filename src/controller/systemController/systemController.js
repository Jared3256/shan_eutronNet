const asyncHandler = require("express-async-handler");
const { sendErrorFoundEmail } = require("../../utils/mailtrap/email");

const reportError = asyncHandler(async (req, res) => {
  const { error, info } = req.body;
const dev = "odhiambojared566@gmail.com";

  await sendErrorFoundEmail(dev, error, info)

  console.log("error", error, "\ninfo - ", info);
  res.send("ssss");
});

module.exports = {
  reportError,
};
