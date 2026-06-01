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
    duration: {
      // it will be in second
      type: Number,
      required: true,
    },
    owner: {
      // TODO 💦❤️
      // ye chal nhi rha abhi ke liye
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      // type: {},
      // required: true,
    },
    isPublished: {
      type: Boolean,
      // required: true,
      default: false,
    },
    description: {
      type: String,
      // baad me retuired true krne hai
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

export const Video = mongoose.model("Video", videoSchema);
