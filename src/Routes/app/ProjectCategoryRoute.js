const express = require("express");
const projectRouter = express.Router();
const hasPermission = require("../../middleware/hasPermission");
const {
  findProjectCategoriesModel,
  createProjectCategory,
  deleteProjectCategoryModel,
  updateProjectCategoryModel,
} = require("../../controller/projectCategoryController/projectCategoryController");

// List all categories
// Method GET
projectRouter.route("/listAll").get(findProjectCategoriesModel);
projectRouter.route("/list").get(findProjectCategoriesModel);

// Create project
// Method POST
projectRouter.route("/create").post(createProjectCategory);

// Delete Project
// Method DELETE
projectRouter.route("/delete/:id").delete(deleteProjectCategoryModel);

// Update Project
// Method PUT
projectRouter.route("/update/:id").put(updateProjectCategoryModel);
module.exports = projectRouter;
