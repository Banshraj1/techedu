// import { Video } from "../model/video.model.js";
// import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";
// import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/index.js";
// // isme video upload and delete ka code hoga
// // rating change krne ka code hoga also likes and connent bhi yahi se mannage hoga

// // const videoUploader = asyncHandler(async (req, res) => {
// //   // console.log("request recieved");

// //   // sabse pahle validate krna hai ki user ek valid user hai using that JWT halanki frontend bhi validate krega but yha se bhi validate krna important hai

// //   // video bahut badi nhi honi chahiye abhi ke liye

// //   // isme user se path lekr usko cloudinary pr upload krana hai then wha se jo response milega usse ek nya video bna kr uska jo response milega usko user ko de dena hai

// //   const verifiedAdmin = req.admin;
// //   // console.log(verifiedUser);

// //   const {
// //     isPublished = false,
// //     description = "No description",
// //     rating,
// //     owner,
// //   } = req.body;

// //   if (!verifiedAdmin) {
// //     throw new ApiError(401, "Unauthorised access Admin not found");
// //   }
// //   if (!owner) {
// //     throw new ApiError(400, "owner field is required");
// //   }
// //   // console.log(req.files);

// //   const videoPath = req.files.video[0].path;
// //   const thumbnailPath = req.files.thumbnail[0].path;
// //   // console.log(videoPath);

// //   if (!videoPath) {
// //     throw new ApiError(404, "video path not found");
// //   }
// //   const uploadedVideoResponse = await uploadOnCloudinary(videoPath);
// //   const uploadedthumbnailResponse = await uploadOnCloudinary(thumbnailPath);

// //   // console.log(uploadedVideoResponse);user

// //   if (!uploadedVideoResponse) {
// //     throw new ApiError(500, "Some error occured during uploading video");
// //   }

// //   const newVideo = await Video.create({
// //     url: uploadedVideoResponse.secure_url,
// //     thumbnail: uploadedthumbnailResponse.secure_url,
// //     duration: uploadedVideoResponse.duration,
// //     thumbnailDetails: uploadedthumbnailResponse,
// //     videoDetails: uploadedVideoResponse,
// //     owner: owner,
// //     isPublished: isPublished,
// //     description: description,
// //   });
// //   if (!newVideo) {
// //     throw new ApiError(500, "error occired during creating new video ");
// //   }
// //   // console.log(newVideo);
// //   console.log(`congratulation ${owner}, your video uploaded successfully`);

// //   return res
// //     .status(200)
// //     .json(new ApiResponse(200, newVideo, "new video uploaded succcessfully"));
// // });
// import {ffmpegFxn} from "../upload/ffmpeg/asdf.js"
// const videoUploader = asyncHandler(async (req, res) => {
//     const verifiedAdmin = req.admin;

//     const {
//         isPublished = false,
//         description = "No description",
//         rating,
//         owner,
//     } = req.body;

//     if (!verifiedAdmin) {
//         throw new ApiError(401, "Unauthorised access Admin not found");
//     }
//     if (!owner) {
//         throw new ApiError(400, "owner field is required");
//     }
//     // console.log(req.files);

//     const videoPath = req.files.video[0].path;
//     const thumbnailPath = req.files.thumbnail[0].path;
//     // console.log(videoPath);

//     if (!videoPath) {
//         throw new ApiError(404, "video path not found");
//     }
//     const uploadedVideoResponse = await uploadOnCloudinary(videoPath);
//     const uploadedthumbnailResponse = await uploadOnCloudinary(thumbnailPath);

//     // console.log(uploadedVideoResponse);user

//     if (!uploadedVideoResponse) {
//         throw new ApiError(500, "Some error occured during uploading video");
//     }

//     const newVideo = await Video.create({
//         url: uploadedVideoResponse.secure_url,
//         thumbnail: uploadedthumbnailResponse.secure_url,
//         duration: uploadedVideoResponse.duration,
//         thumbnailDetails: uploadedthumbnailResponse,
//         videoDetails: uploadedVideoResponse,
//         owner: owner,
//         isPublished: isPublished,
//         description: description,
//     });
//     if (!newVideo) {
//         throw new ApiError(500, "error occired during creating new video ");
//     }
//     // console.log(newVideo);
//     console.log(`congratulation ${owner}, your video uploaded successfully`);

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, newVideo, "new video uploaded succcessfully"),
//         );
// });

// const updateRating = asyncHandler(async (req, res) => {
//   const verifiedAdmin = req.admin;
//   // console.log(req);
//   const { rating, videoId } = req.body;
//   // console.log(rating, videoId);
//   if (!rating || rating < 0 || rating > 10) {
//     throw new ApiError(400, "Invalid rating value");
//   }
//   const myVideo = await Video.findById(videoId);
//   if (!myVideo) {
//     throw new ApiError(404, "Video not found");
//   }

//   if (!verifiedAdmin) {
//     throw new ApiError(401, "Unauthorised access::Admin not found");
//   }
//   // console.log(myVideo)

//   // const user = await User.findById(verifiedUser._id).select(
//   //   "-password -backupPassword",
//   // );
//   // if (!user) {
//   //   throw new ApiError(401, "Unauthorised access::User not found");
//   // }

//   const isRatingchanged = await myVideo.changeRating(rating);
//   // console.log(isRatingchanged);
//   if (!isRatingchanged) {
//     throw new ApiError(500, "some error occured during changing rating");
//   }

//   await myVideo.save();
//   return res
//     .status(200)
//     .json(new ApiResponse(200, myVideo, "Rating updated successfully"));
// });

// const deleteVideo = asyncHandler(async (req, res) => {
//   const verifiedAdmin = req.admin;
//   const { videoId } = req.body;
//   const myVideo = await Video.findById(videoId);
//   if (!myVideo) {
//     throw new ApiError(404, "Video not found");
//   }

//   if (!verifiedAdmin) {
//     throw new ApiError(401, "Unauthorised access::Admin not found");
//   }

//   const deletedResponse = await Video.deleteOne({ _id: myVideo._id });
//   if (!deletedResponse) {
//     throw new ApiError(500, "deletion failed");
//   }

//   // Delete the video file from Cloudinary
//   const deletedFromCloudinary = await deleteFromCloudinary(
//     myVideo.videoDetails.public_id,
//     myVideo.videoDetails.resource_type,
//   );
//   if (!deletedFromCloudinary) {
//     throw new ApiError(500, "Failed to delete video from Cloudinary");
//   }
//   // Delete the thumbnail file from Cloudinary
//   const deletedThumbnailFromCloudinary = await deleteFromCloudinary(
//     myVideo.thumbnailDetails.public_id,
//     myVideo.thumbnailDetails.resource_type,
//   );
//   if (!deletedThumbnailFromCloudinary) {
//     throw new ApiError(500, "Failed to delete thumbnail from Cloudinary");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, null, "Video deleted successfully"));
// });

// const getVideoById = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   console.log(videoId);
//   const myVideo = await Video.findById(videoId);
//   if (!myVideo) {
//     throw new ApiError(404, "Video not found");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, myVideo, "Video found successfully"));
// });

// const publishVideo = asyncHandler(async (req, res) => {
//   const verifiedAdmin = req.admin;
//   const { videoId } = req.body;
//   const myVideo = await Video.findById(videoId);
//   if (!myVideo) {
//     throw new ApiError(404, "Video not found");
//   }
//   if (!verifiedAdmin) {
//     throw new ApiError(401, "Unauthorised access::Admin not found");
//   }
//   if (myVideo.isPublished) {
//     throw new ApiError(400, "Video is already published");
//   }
//   const publishedResponse = await myVideo.changePublishStatus(true);
//   if (!publishedResponse) {
//     throw new ApiError(500, "Failed to publish video");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, myVideo, "Video published successfully"));
// });

// const banVideo = asyncHandler(async (req, res) => {
//   const verifiedAdmin = req.admin;
//   const { videoId } = req.body;
//   const myVideo = await Video.findById(videoId);
//   if (!myVideo) {
//     throw new ApiError(404, "Video not found");
//   }
//   if (!verifiedAdmin) {
//     throw new ApiError(401, "Unauthorised access::Admin not found");
//   }
//   if (!myVideo.isPublished) {
//     throw new ApiError(400, "Video is already banned");
//   }
//   const banVideoResponse = await myVideo.changePublishStatus(false);
//   if (!banVideoResponse) {
//     throw new ApiError(500, "Failed to ban video");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, myVideo, "Video banned successfully"));
// });
// const updateVideoDetails = asyncHandler(async (req, res) => {
//   const verifiedAdmin = req.admin;
//   const { videoId, title, description, owner } = req.body;
//   console.log(videoId, title, description, owner);
//   const myVideo = await Video.findById(videoId);
//   if (!videoId) {
//     throw new ApiError(400, "Video ID is required");
//   }
//   if (!title && !description && !owner) {
//     throw new ApiError(
//       400,
//       "At least one field (title, description, owner) is required to update",
//     );
//   }
//   if (!myVideo) {
//     throw new ApiError(404, "Video not found");
//   }
//   if (!verifiedAdmin) {
//     throw new ApiError(401, "Unauthorised access::Admin not found");
//   }
//   if (title) {
//     const updatedTitleResponse = await myVideo.changeTitle(title);
//     if (!updatedTitleResponse) {
//       throw new ApiError(500, "Failed to update video title");
//     }
//   }
//   if (owner) {
//     const updatedOwnerResponse = await myVideo.changeOwner(owner);
//     if (!updatedOwnerResponse) {
//       throw new ApiError(500, "Failed to update video owner");
//     }
//   }
//   if (description) {
//     const updatedDescriptionResponse =
//       await myVideo.changeDescription(description);
//     if (!updatedDescriptionResponse) {
//       throw new ApiError(500, "Failed to update video description");
//     }
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, myVideo, "Video details updated successfully"));
// });

// export {
//   videoUploader,
//   updateRating,
//   deleteVideo,
//   getVideoById,
//   publishVideo,
//   banVideo,
//   updateVideoDetails,
// };

// //_id= 6a20cbb79e681365cb4abd37
