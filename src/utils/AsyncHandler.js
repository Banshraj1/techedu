const asyncHandler = (fxn) => async (req, res, next) => {
  try {
    return await fxn(req, res, next);
  } catch (error) {
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Some error occured",
    });
  }
};

//this can also work

// const asyncHandler = (fxn) => {
//   return (req, res, next) => {
//     Promise.resolve(fxn(req, res, next)).catch((err) => next(err));
//   };
// };

export { asyncHandler };
