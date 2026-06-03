import { Playlist } from "../model/playlist.model.js";
import { User } from "../model/user.model.js";
import { Admin } from "../model/admin.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../utils";
import { Video } from "../model/video.model.js";
// isme playlist crete krne ka method hoga usme elements add krne ka and element delete krne ka then playlist delete krne ka
//
// TODO :: baad me playlist ka name bhi update krne ka option hoga
//
const createPlaylist = asyncHandler(async (req, res) => {
  // unique playlistName
  const admin = req.admin;
  if (!admin) {
    throw new ApiError(404, "Unauthorised access::admin not found");
  }
  const { playlistName } = req.body;
  const isAvailable = await Playlist.findOne({ playlistName: playlistName });
  if (isAvailable) {
    console.log("This playlist name is already taken");
    throw new ApiError(401, "This playlist name is already taken");
  }

  const createdPlaylist = await Playlist.create({
    playlistName: playlistName,
    elements: null,
    stars: 0,
  });

  const response = await Playlist.findById(createdPlaylist._id);
  if (!response) {
    console.log("some error occured during playlist creation");
    throw new ApiError(500, "some error occured during playlist creation");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Playlist created successfully"));
});

const insertOne = asyncHandler(async (req, res) => {
  const admin = req.admin;
  const { playlistName, videoId } = req.body;
  // videos is an array
  if (!admin) {
    throw new ApiError(404, "Unauthorised access::admin not found");
  }

  if (!videoId) {
    console.log("VideoId is must");
    throw new ApiError(404, "VideoId is must");
  }

  if (!playlistName) {
    console.log("playlist Name is must");
    throw new ApiError(404, "playlist Name is must");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    console.log("Video with given id not found");
    throw new ApiError(404, "Video with given id not found");
  }

  const searchPlaylist = await Playlist.findOne({ playlistName: playlistName });
  if (searchPlaylist) {
    // plalist is available and we need to update it
    const response = await searchPlaylist.addVideo(video);
    if (!response) {
      throw new ApiError(
        500,
        "some error occured during video addition in given playlist",
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Video added successfully"));
  } else {
    // we need to create a new one
    let videoArray = [video];
    const newPlaylist = await Playlist.create({
      playlistName: playlistName,
      elements: videoArray,
      start: 0,
    });
    if (!newPlaylist) {
      throw new ApiError(500, "something went wrong dyring playlist creation");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, newPlaylist, "playlist successfully created"));
  }
});

const insertMultiple = asyncHandler(async (req, res) => {
  const admin = req.admin;
  if (!admin) {
    throw new ApiError(404, "Unauthorised access::admin not found");
  }
  const { playlistId, videos } = req.body; // video is an array of video ids
  if (!playlistId) {
    throw new ApiError(404, "playlistId is must");
  }

  const searchPlaylist = await Playlist.findById(playlistId);
  if (!searchPlaylist) {
    throw new ApiError(404, "playlist with given id not found");
  }

  if (!videos || videos.length === 0) {
    throw new ApiError(404, "videos array is must and should not be empty");
  }
  for (let id of videos) {
    const video = await Video.findById(id);
    if (!video) {
      throw new ApiError(404, `Video with given id ${id} not found`);
    }
  }
  let videoArray = [];
  for (let id of videos) {
    const video = await Video.findById(id);
    videoArray.push(video);
  }
  const response = await searchPlaylist.addMultipleVideo(videoArray);
  if (!response) {
    throw new ApiError(
      500,
      "some error occured during video addition in given playlist",
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Videos added successfully"));
});

// const insertById = asyncHandler(async (req, res) => {});

const deleteVideo = asyncHandler(async (req, res) => {
  const admin = req.admin;
  if (!admin) {
    throw new ApiError(404, "Unauthorised access::admin not found");
  }
  const { playlistId, videoId } = req.body;
  if (!playlistId) {
    throw new ApiError(404, "playlistId is must");
  }
  if (!videoId) {
    throw new ApiError(404, "videoId is must");
  }
  const searchPlaylist = await Playlist.findById(playlistId);
  if (!searchPlaylist) {
    throw new ApiError(404, "playlist with given id not found");
  }
  const response = await searchPlaylist.removeVideo(videoId);
  if (!response) {
    throw new ApiError(
      500,
      "some error occured during video removal from given playlist",
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Video removed successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const admin = req.admin;
  if (!admin) {
    throw new ApiError(404, "Unauthorised access::admin not found");
  }
  const { playlistId } = req.body;
  if (!playlistId) {
    throw new ApiError(404, "playlistId is must");
  }
  const searchPlaylist = await Playlist.findById(playlistId);
  if (!searchPlaylist) {
    throw new ApiError(404, "playlist with given id not found");
  }
  const response = await Playlist.findByIdAndDelete(playlistId);
  if (!response) {
    throw new ApiError(500, "some error occured during playlist deletion");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Playlist deleted successfully"));
});

export {
  createPlaylist,
  insertOne,
  insertMultiple,
  deleteVideo,
  deletePlaylist,
};
