import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router=Router();
// console.log(registerUser);

// this is a demo for router.route
// router.route("/hello").get((req,res,next)=>{
//     res.send("Hello ")
// })
router.route("/register").post(registerUser);


export {router}