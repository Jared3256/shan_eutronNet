const login = require("./login");
const logout = require("./logout");
const refresh = require("./refresh");
const verifyEmail = require("./verifyEmail");
const forgotPassword = require("./forgotPassword");
const resetPassword = require("./resetPassword");
const CoreUser = require("../../../models/coreModels/User.core");

const createAuthMiddleware = () => {
  let authMethods = {};

  // // Login Method // //
  authMethods.login = (req, res) => login(CoreUser, req, res);
  authMethods.refresh = (req, res) => refresh(CoreUser, req, res);
  authMethods.logout = (req, res) => logout(CoreUser, req, res);
  authMethods.verifyEmail = (req, res) => verifyEmail(CoreUser, req, res);
  authMethods.forgotPassword = (req, res) => forgotPassword(CoreUser, req, res);
  authMethods.resetPassword = (req, res) => resetPassword(CoreUser, req, res);
  return authMethods;
};

module.exports = createAuthMiddleware();
