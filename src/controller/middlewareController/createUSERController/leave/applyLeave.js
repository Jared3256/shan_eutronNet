// Import the express async Handler
const { differenceInBusinessDays, isAfter, isFuture } = require("date-fns");
const asyncHandler = require("express-async-handler");

// Import the UserLeave Model
const UserLeave = require("../../../../models/app/UserLeave");

const applyLeave = asyncHandler(async (User, req, res) => {
  // Get the user Id from the request params

  const { id } = req.params;
  const { start, end, data } = req.body;

  if (!start || !end || !data ||!id) {
    return res.status(406).json({
      message: "critical information is missing",
      success: false,
    });
  }

  if (String(id).length !== 24) {
    return res.status(411).json({
      message: "Id format mismatch",
      success: false,
    });
  }

  try {
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(400).json({
        message: "no user matches the id",
        success: false,
      });
    }

    // Check if the end date comes before the start
    if (!isAfter(end, start)) {
      return res.status(409).json({
        message: "ending date cannot come before the start",
        success: false,
        result: {
          ...req.body,
        },
      });
    }

    // Check if the start date is not today or future
    if (!isFuture(start)) {
      return res.status(409).json({
        message: "start date cannot be past days",
        success: false,
        result: {
          ...req.body,
        },
      });
    }

    // Check if the start date is seven days or five working days after today

    if (differenceInBusinessDays(start, Date.now()) < 10) {
      return res.status(409).json({
        message: "all leave request must be made 10 or more working days ahead",
        success: false,
        result: {
          ...req.body,
        },
      });
    }
    //   calculate the date difference
    const difference = Math.abs(differenceInBusinessDays(start, end));

    // Check the user remaining day
    if (foundUser.year_leave === 0 || foundUser.year_leave - difference < 0) {
      return res.status(417).json({
        message: "you have insufficient leave balance.",
        success: false,
      });
    }

    // Check is a similar request is already registered
    const foundLeave = await UserLeave.findOne({
      start,
      end,
      user:id
    });

    if (foundLeave) {
      return res.status(417).json({
        message: "a similar request already exists",
        success: false,
      });
    }
    foundUser.year_leave = foundUser.year_leave - difference;

    await foundUser.save();

    // Create and save the apply leave model
    const newLeave = new UserLeave({
      start,
      end,
      data,
      total: difference,
      user:id
    });

    await newLeave.save();

    // Send the manager email notification

    return res.status(200).json({
      message: "request submitted successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(422).json({
      message: "no user matches the id",
      success: false,
    });
  }
});


// {
//   "start":"Tue Dec 15 2024 11:00:00 GMT+0300 (East Africa Time)",
//   "end":"Tue Dec 26 2024 10:00:00 GMT+0300 (East Africa Time)",
//   "data":{
//     "appointment":{
//       "address":"Building 5\nStreet 44\nNear Express Highway\nKisumu",
//       "id":"sdsd",
//       "location": "Kisumu",
//       "status":"P",
//       "resource":"Sir Jarred"
//     }
//   }
// }
module.exports = applyLeave;
