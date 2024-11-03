const express = require("express");
const projectRouter = express.Router();
const hasPermission = require("../../middleware/hasPermission");
const {
  findProjectCategoriesModel,
  createProjectCategory,
} = require("../../controller/projectCategoryController/projectCategoryController");

// List all categories 
// Method GET
projectRouter.route("/listAll").get(findProjectCategoriesModel);

// Create project
// Method POST
 projectRouter.route("/create").post(createProjectCategory) 
module.exports = projectRouter;
