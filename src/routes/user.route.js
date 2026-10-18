import { Router } from "express";
import {
    deleteUser,
    loginUser,
    logoutUser,
    registerUser,
    aboutUser,
    getCurrentUser,
    expandWatchHistory,
    compressWatchHistory,
    verifyOTP,
    getOTP,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

// console.log(registerUser);

// this is a demo for router.route
// router.route("/hello").get((req,res,next)=>{
//     res.send("Hello ")
// })

router.route("/register").post(registerUser);
router.route("/veriftOTP").patch(verifyOTP);
router.route("/getOTP").post(getOTP);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/delete").post(verifyJwt, deleteUser);
router.route("/about/:username").post(verifyJwt, aboutUser);
router.route("/get-me").get(verifyJwt, getCurrentUser);
router
    .route("/watch-history/expand:videoId")
    .patch(verifyJwt, expandWatchHistory);
router
    .route("/watch-history/compress:videoId")
    .patch(verifyJwt, compressWatchHistory);

// import {
//     getOTP,
//     registerUser as verifiedRegister,
//     verifyOTPraju,
// } from "../controllers/newuser.controller.js";
// router.route("/verified/getOtp").post(getOTP);
// router.route("/verified/veriftOTP").post(verifyOTPraju);
// router.route("/verified/register").post(verifiedRegister);

export { router };
