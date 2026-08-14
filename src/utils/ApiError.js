// class ApiError extends Error {
//   constructor(
//     statuscode = 504,
//     message = "Something went wrong",
//     data,
//     error = [],
//     stack = "",
//   ) {
//     super(message);
//     this.statuscode = statuscode;
//     if (data) {
//       this.data = data;
//     } else {
//       this.data = null;
//     }
//     // this.data = data ? data : null;
//     (this, (message = message));
//     ((this.error = error), (this.success = false));
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }
// export { ApiError };
