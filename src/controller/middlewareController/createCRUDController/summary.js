const summary = async (Model, req, res) => {
  //  Query the database for a list of all results
  const countPromise = Model.countDocuments({
    removed: false,
  });

  const resultsPromise = await Model.countDocuments({
    removed: false,
  })

 
    // .where(req.query.filter)
    // .equals(req.query.equal)
    .exec();
  
  // Resolving both promises
  const [countFilter, countAllDocs] = await Promise.all([resultsPromise, countPromise]);
  console.log("🚀 ~ summary ~ [countFilter, countAllDocs] :", [countFilter, countAllDocs] )
 const results =  await Model.find({})
  if (countAllDocs> 0) {
    let total = 0


    results.forEach(model => {
      total = total + model.total
    });
    return res.status(200).json({
      success: true,
      result: total,
      message: 'Successfully count all documents',
    });
  } else {
    console.log("Executing 2")
    return res.status(203).json({
    
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = summary;
