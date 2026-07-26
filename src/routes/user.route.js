import { Router } from "express";
import {
  deleteUser,
  loginUser,
  logoutUser,
  registerUser,
  aboutUser,
  expandWatchHistory,
  compressWatchHistory,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

// console.log(registerUser);

// this is a demo for router.route
// router.route("/hello").get((req,res,next)=>{
//     res.send("Hello ")
// })

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/delete").post(verifyJwt, deleteUser);
router.route("/about/:username").post(verifyJwt, aboutUser);
router.route("/watch-history/expand:videoId").patch(verifyJwt, expandWatchHistory);
router.route("/watch-history/compress:videoId").patch(verifyJwt, compressWatchHistory);
export { router };
