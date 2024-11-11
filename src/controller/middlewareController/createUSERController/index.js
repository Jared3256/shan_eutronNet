const create = require("./create");
const disable = require("./disable")

// import the user model
const CoreUser = require("../../../models/coreModels/User.core");

const createUserController = () => {
  let userController = {};

  userController.create = (req, res) => create(CoreUser, req, res);
  userController.disable = (req, res)=> disable(CoreUser, req, res)
  return userController;
};

module.exports = createUserController();
