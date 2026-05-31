import mongoose from "mongoose";
// link from aws,description,likes,dislikes,comments,uploaded at
const videoSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: string,
      required: true,
    },
    duration: {
      // it will be in second
      type: number,
      required: true,
    },
    owner: {
      type: string,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    description: {
      type: string,
      // baad me retuired true krne hai
      // required:true
    },
    rating: {
      type: number,
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
