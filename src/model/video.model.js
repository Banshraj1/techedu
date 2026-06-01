import mongoose from "mongoose";
import { Comment } from "./comment.model.js";
import { User } from "./user.model.js";
// link from aws,description,likes,dislikes,comments,uploaded at
const videoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    thumbnailDetails: {
      type: {},
    },
    videoDetails: {
      type: {},
    },
    duration: {
      // it will be in second
      type: Number,
      required: true,
    },
    owner: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: User,
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      // required: true,
      default: false,
    },
    description: {
      type: String,
      // baad me required true krne hai TODO
      // required:true
    },
    rating: {
      type: Number,
      default: 0,
    },
    comments: {
      // it will be an array or priority queue
      type: mongoose.Schema.Types.ObjectId,
      ref: Comment,
    },
    likescount: {
      type: Number,
      default: 0,
      required: true,
    },
    dislikescount: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true },
);

videoSchema.methods.changeRating = async function (newRating) {
  // console.log("in method");
  this.rating = newRating;
  return await this.save();
};
videoSchema.methods.changePublishStatus = async function (isPublished) {
  this.isPublished = isPublished;
  return await this.save();
};

export const Video = mongoose.model("Video", videoSchema);
