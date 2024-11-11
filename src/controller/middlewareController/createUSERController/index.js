const create = require("./create");
const disable = require("./disable");
const listAll = require("./listAll");

// import the user model
const CoreUser = require("../../../models/coreModels/User.core");

const createUserController = () => {
  let userController = {};

  userController.create = (req, res) => create(CoreUser, req, res);
  userController.disable = (req, res) => disable(CoreUser, req, res);
  userController.listAll = (req, res) => listAll(CoreUser, req, res);
  return userController;
};

module.exports = createUserController();
