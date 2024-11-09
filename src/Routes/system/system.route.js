const express = require("express");
const {
  reportError,
} = require("../../controller/systemController/systemController");

const systemRouter = express.Router();

systemRouter.route("/report").post(reportError);
module.exports = systemRouter

