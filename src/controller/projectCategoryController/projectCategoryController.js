const Model = require("../../models/app/ProjectCategory");

// import date-fns package to handle the dates
const { isAfter, isToday, differenceInCalendarDays, differenceInBusinessDays } = require("date-fns");

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
  const { name, start, end_date } = req.body;

  // Check the critical information
  if (!name || !start || !end_date) {
    return res.status(400).json({
      success: false,
      message: "critical information is missing",
    });
  }

  // Check if there exists a project with the passed credentials
  const foundProject = await Model.findOne({ name, start, end_date });

  if (foundProject) {
    return res
      .status(417)
      .json({ message: "project is already created", success: false });
  }

  // Check if the starting day is not a day behind of today
  if (!(isToday(start) || isAfter(start, Date.now()))) {
    return res.status(412).json({
      message: `cannot create project which started ${new Intl.NumberFormat().format(
        differenceInBusinessDays(Date.now(), start)
      )} working days ago`,
      success: false,
    });
  }
  // Check if the dates are equal
  if (start === end_date) {
    return res.status(417).json({
      message: "one day projects are currently not supported",
      success: false,
    });
  }
  // Check if the end date is always after the start date
  if (!isAfter(end_date, start)) {
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
module.exports = {
  findProjectCategoriesModel,
  createProjectCategory,
};
