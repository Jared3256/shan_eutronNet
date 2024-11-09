const Model = require("../../models/app/ProjectCategory");

// import date-fns package to handle the dates
const {
  isAfter,
  isToday,
  differenceInCalendarDays,
  differenceInBusinessDays,
} = require("date-fns");

// Import express async handler
const asyncHandler = require("express-async-handler");

// Function to FindAll Project categories
// Access Private
// Endpoint /api/projectcategory/listAll
const findProjectCategoriesModel = asyncHandler(async (req, res) => {
  const models = await Model.find();

  if (!models.length) {
    return res
      .status(404)
      .json({ message: "Collection is empty", success: false });
  }
  res.json(models);
});

// Function create and save new project category
// Access Private
// Endpoint /api/projectcategory/create
const createProjectCategory = asyncHandler(async (req, res) => {
  const { name, start_date, end_date } = req.body;
  console.log(req.body);

  // Check the critical information
  if (!name || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "critical information is missing",
    });
  }

  // Check if there exists a project with the passed credentials
  const foundProject = await Model.findOne({ name, start_date, end_date });

  if (foundProject) {
    return res
      .status(417)
      .json({ message: "project is already created", success: false });
  }

  // Check if the starting day is not a day behind of today
  if (!(isToday(start_date) || isAfter(start_date, Date.now()))) {
    return res.status(412).json({
      message: `cannot create project which started ${new Intl.NumberFormat().format(
        differenceInBusinessDays(Date.now(), start_date)
      )} working days ago`,
      success: false,
    });
  }
  // Check if the dates are equal
  if (start_date === end_date) {
    return res.status(417).json({
      message: "one day projects are currently not supported",
      success: false,
    });
  }
  // Check if the end date is always after the start date
  if (!isAfter(end_date, start_date)) {
    return res
      .status(412)
      .json({ message: "end date cannot come before start", success: false });
  }

  const result = await new Model({
    ...req.body,
  }).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: "project category created successfully",
  });
});

const deleteProjectCategoryModel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //   Check the length of the id
  if (String(id).length !== 24) {
    return res
      .status(412)
      .json({ message: "bad project id format", success: false });
  }

  const foundProject = await Model.findById(id);

  if (!foundProject) {
    return res
      .status(417)
      .json({ message: "no project matches your id", success: false });
  }

  if (foundProject.enabled) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you can't delete active project category",
    });
  }

  await Model.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    result: null,
    message: "project category deleted successfully",
  });
});

const updateProjectCategoryModel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check the length of the Id
  if (String(id).length !== 24) {
    return res.status(412).json({
      message: "project id format is mismatched",
      success: false,
    });
  }
  const project = await Model.findOne({
    _id: id,
  }).exec();

  if (!project) {
    return res
      .status(417)
      .json({ message: "no project matches the id", success: false });
  }

  const projectCatCount = await Model.countDocuments({});

  if (projectCatCount <= 1 && req.body.enabled === false) {
    return res.status(405).json({
      message: "cannot disable this project",
      success: false,
    });
  }

  const result = await Model.findOneAndUpdate(
    {
      _id: id,
    },
    req.body,
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "project category updated successfully",
    result,
  });
});

module.exports = {
  findProjectCategoriesModel,
  createProjectCategory,
  deleteProjectCategoryModel,
  updateProjectCategoryModel,
};
