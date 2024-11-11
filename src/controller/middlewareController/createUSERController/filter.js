const asyncHandler = require("express-async-handler");

const filter = asyncHandler(async (User, req, res) => {
  if (req.query.filter === undefined || req.query.equal === undefined) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "filter not provided correctly",
    });
  }
  const result = await User.find({ removed: false })
    .where(req.query.filter)
        .equals(req.query.equal);
    
    if (result.length === 0) {
        return res.status(417).json({
            success: true,
            result: null,
                message:"no user document matches filter criteria"
        })
    }

  return res.status(200).json({
    success: true,
    result,
    message: "Successfully found all documents  ",
  });
});

module.exports = filter;
