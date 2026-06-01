import { Video } from "../model/video.model.js";
import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";
import { uploadOnCloudinary } from "../utils/index.js";
// isme video upload and delete ka code hoga
// rating change krne ka code hoga also likes and connent bhi yahi se mannage hoga

const videoUploader = asyncHandler(async (req, res) => {
  console.log("request recieved");

  // sabse pahle validate krna hai ki user ek valid user hai using that JWT halanki frontend bhi validate krega but yha se bhi validate krna important hai

  // video bahut badi nhi honi chahiye abhi ke liye

  // isme user se path lekr usko cloudinary pr upload krana hai then wha se jo response milega usse ek nya video bna kr uska jo response milega usko user ko de dena hai

  const verifiedUser = req.user;
  // console.log(verifiedUser);

  const {
    isPublished = false,
    description = "No description",
    rating,
  } = req.body;

  if (!verifiedUser) {
    throw new ApiError(401, "Unauthorised access User not found");
  }
  // console.log(req.files);

  const videoPath = req.files.video[0].path;
  const thumbnailPath = req.files.thumbnail[0].path;
  // console.log(videoPath);

  if (!videoPath) {
    throw new ApiError(404, "video path not found");
  }
  const uploadedVideoResponse = await uploadOnCloudinary(videoPath);
  const uploadedthumbnailResponse = await uploadOnCloudinary(thumbnailPath);

  // console.log(uploadedVideoResponse);user

  if (!uploadedVideoResponse) {
    throw new ApiError(500, "Some error occured during uploading video");
  }

  const newVideo = await Video.create({
    url: uploadedVideoResponse.secure_url,
    thumbnail: uploadedthumbnailResponse.secure_url,
    duration: uploadedVideoResponse.duration,
    owner: verifiedUser,
    isPublished: isPublished,
    description: description,
  });
  if (!newVideo) {
    throw new ApiError(500, "error occired during creating new video ");
  }
  // console.log(newVideo);
  console.log(
    `congratulation ${verifiedUser.username}, your video uploaded successfully`,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "new video uploaded succcessfully"));
});

export { videoUploader };
