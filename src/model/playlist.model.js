import mongoose, { Types } from "mongoose";
import { Video } from "./video.model.js";
import { User } from "./user.model.js";
const playlistSchema = new mongoose.Schema(
  {
    playlistName: {
      type: String,
      unique: true,
      required: true,
    },
    elements: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    },
    stars: {
      type: Number,
    },
  },
  { timestamps: true },
);

playlistSchema.methods.addVideo = async function (video) {
  this.elements.push(video);
  return this.save();
};
playlistSchema.methods.addMultipleVideo = async function (videos) {
  // videos is an array
  this.elements.push(...videos);
  return this.save();
};
playlistSchema.methods.removeVideo = async function (videoId) {
  this.elements = this.elements.filter((elem) => elem._id !== videoId);
  return this.save();
};
export const Playlist = mongoose.model("Playlist", playlistSchema);
