import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt, adminVerification } from "../middleware/auth.middleware.js";
const adminRouter = Router();

// this is a demo for router.route
// router.route("/upload").get((req,res,next)=>{
//     res.send("Hello ")
// })

// these routes for admin registration and login
import { registerAdmin, loginAdmin } from "../controllers/admin.controller.js";

adminRouter.route("/register").post(registerAdmin);
adminRouter.route("/login").post(loginAdmin);

//these rotues are for video management
import {
  videoUploader,
  updateRating,
  deleteVideo,
  getVideoById,
  publishVideo,
  banVideo,
} from "../controllers/video.contorller.js";

adminRouter.route("/upload").post(
  adminVerification,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  videoUploader,
);
adminRouter.route("/v/create/rating").patch(adminVerification, updateRating);
adminRouter.route("/v/delete/video").delete(adminVerification, deleteVideo);
adminRouter.route("/v/get/video").get(adminVerification, getVideoById);
adminRouter.route("/v/publish/video").patch(adminVerification, publishVideo);
adminRouter.route("/v/ban/video").patch(adminVerification, banVideo);

// these routes are for playlist management
import {
  createPlaylist,
  insertOne,
  insertMultiple,
  deleteVideo,
  deletePlaylist,
} from "../controllers/playlist.controller.js";

adminRouter.route("/p/create/playlist").post(adminVerification, createPlaylist);
adminRouter.route("/p/insert/video").patch(adminVerification, insertOne);
adminRouter.route("/p/insert/videos").patch(adminVerification, insertMultiple);
adminRouter.route("/p/delete/video").delete(adminVerification, deleteVideo);
adminRouter.route("/p/delete/playlist").delete(adminVerification, deletePlaylist);

export { adminRouter };
