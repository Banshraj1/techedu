import { Playlist } from "../model/playlist.model.js";
import { User } from "../model/user.model.js";
import { Admin } from "../model/admin.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
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
    elements: [],
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
    let videoArray = [video._id];
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
  const videoarrcomming = videos.split(",").map((id) => id.trim());
  if (!playlistId) {
    throw new ApiError(404, "playlistId is must");
  }

  const searchPlaylist = await Playlist.findById(playlistId);
  if (!searchPlaylist) {
    throw new ApiError(404, "playlist with given id not found");
  }

  if (!videoarrcomming || videoarrcomming.length === 0) {
    throw new ApiError(404, "videos array is must and should not be empty");
  }
  for (let id of videoarrcomming) {
    const video = await Video.findById(id);
    if (!video) {
      throw new ApiError(404, `Video with given id ${id} not found`);
    }
  }
  //TODO :: we can optimize this by using $in operator of mongoose to fetch all videos in one query instead of multiple queries in above loop
  let videoIdArray = [];
  for (let id of videoarrcomming) {
    const video = await Video.findById(id);
    videoIdArray.push(video._id);
  }
  const response = await searchPlaylist.addMultipleVideo(videoIdArray);
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

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.body;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist found successfully"));
});

const deleteVideoInPlaylist = asyncHandler(async (req, res) => {
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
  deleteVideoInPlaylist,
  deletePlaylist,
  getPlaylistById,
};
