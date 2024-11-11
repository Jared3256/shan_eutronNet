const create = require("./create");
const disable = require("./disable");
const listAll = require("./listAll");
const paginatedList = require("./paginatedList");
const filter = require("./filter");
const remove = require("./remove");

// import the user model
const CoreUser = require("../../../models/coreModels/User.core");

const createUserController = () => {
  let userController = {};

  userController.create = (req, res) => create(CoreUser, req, res);
  userController.disable = (req, res) => disable(CoreUser, req, res);
  userController.listAll = (req, res) => listAll(CoreUser, req, res);
  userController.paginatedList = (req, res) =>
    paginatedList(CoreUser, req, res);
  userController.filter = (req, res) => filter(CoreUser, req, res);
  userController.remove = (req, res) => remove(CoreUser, req, res);
  return userController;
};

module.exports = createUserController();
