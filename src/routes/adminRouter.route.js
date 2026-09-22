import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt, adminVerification } from "../middleware/auth.middleware.js";
const adminRouter = Router();

// this is a demo for router.route
// router.route("/upload").get((req,res,next)=>{
//     res.send("Hello ")
// })
// these routes for admin registration and login
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";

// for register register, email,password,backupPassword,phone
adminRouter.route("/register").post(registerAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").post(adminVerification, logoutAdmin);
adminRouter.route("/delete").delete(adminVerification, deleteAdmin);

//these rotues are for video management
import {
  videoUploader,
  updateRating,
  deleteVideo,
  getVideoById,
  publishVideo,
  banVideo,
  updateVideoDetails,
} from "../controllers/video.contorller.js";

adminRouter.route("/v/upload").post(
  adminVerification,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  videoUploader,
);
adminRouter.route("/v/change/rating").patch(adminVerification, updateRating);
adminRouter.route("/v/get/video/:videoId").get(getVideoById);
adminRouter.route("/v/publish/video").patch(adminVerification, publishVideo);
adminRouter.route("/v/ban/video").patch(adminVerification, banVideo);
adminRouter.route("/v/delete/video").delete(adminVerification, deleteVideo);
adminRouter.route("/v/update/video").patch(adminVerification, updateVideoDetails);

// these routes are for playlist management
import {
  createPlaylist,
  insertOne,
  insertMultiple,
  deleteVideoInPlaylist,
  deletePlaylist,
  getPlaylistById,
} from "../controllers/playlist.controller.js";

adminRouter.route("/p/create/playlist").post(adminVerification, createPlaylist);
adminRouter.route("/p/insert/video").patch(adminVerification, insertOne);
adminRouter.route("/p/insert/videos").patch(adminVerification, insertMultiple);
adminRouter
  .route("/p/delete/video")
  .delete(adminVerification, deleteVideoInPlaylist);
adminRouter
  .route("/p/delete/playlist")
  .delete(adminVerification, deletePlaylist);

  // TODO blunder niche wala route ko user ke route me rahkna tha 
adminRouter.route("/p/get/playlist/:playlistId").get(getPlaylistById); // no need of admin verification
// upar tk sb thik hai

export { adminRouter };
