import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";


const router=Router();
// console.log(registerUser);

// this is a demo for router.route
// router.route("/hello").get((req,res,next)=>{
//     res.send("Hello ")
// })
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);


export {router}