const asyncHandler = require("express-async-handler");

const listAll = asyncHandler(async (User, req, res) => {
  const limit = parseInt(req.query.items) || 100;

  //  Query the database for a list of all results
  const result = await User.find({ removed: false, enabled: true })
    .sort({ enabled: -1 })
    .populate()
    .exec();
  // Counting the total documents
  // Resolving both promises
  // Calculating total pages

  // Getting Pagination Object
  if (result.length > 0) {
    const nResult = result.slice(0, limit);

    return res.status(200).json({
      success: true,
      result: nResult,
      message: "Successfully found all user documents",
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: "No User found",
    });
  }
});

module.exports = listAll;
