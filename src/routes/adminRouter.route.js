import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { videoUploader } from "../controllers/video.contorller.js";

const adminRouter = Router();

// this is a demo for router.route
// router.route("/upload").get((req,res,next)=>{
//     res.send("Hello ")
// })

adminRouter.route("/upload").post(
  verifyJwt,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  videoUploader,
);

export { adminRouter };
