import mongoose, { Types } from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    elements: {
      type: [],
    },
    stars: {
      type: Number,
    },
  },
  { timestamps: true },
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
