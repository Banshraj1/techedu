import { Router } from "express";
import { deleteUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = Router();
// console.log(registerUser);

// this is a demo for router.route
// router.route("/hello").get((req,res,next)=>{
//     res.send("Hello ")
// })

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser)
router.route("/delete").post(deleteUser)
export { router };
