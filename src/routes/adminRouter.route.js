import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt, adminVerification } from "../middleware/auth.middleware.js";
import {
  videoUploader,
  updateRating,
  deleteVideo,
  getVideoById,
  publishVideo,
} from "../controllers/video.contorller.js";
import { registerAdmin, loginAdmin } from "../controllers/admin.controller.js";
const adminRouter = Router();

// this is a demo for router.route
// router.route("/upload").get((req,res,next)=>{
//     res.send("Hello ")
// })

adminRouter.route("/register").post(registerAdmin);
adminRouter.route("/login").post(loginAdmin);

adminRouter.route("/upload").post(
  adminVerification,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  videoUploader,
);
adminRouter.route("/c/rating").post(adminVerification, updateRating);
adminRouter.route("/d/video").get(adminVerification, deleteVideo);
adminRouter.route("/get/video").get(adminVerification, getVideoById);
adminRouter.route("/publish/video").post(adminVerification, publishVideo);

export { adminRouter };
