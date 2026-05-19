import mongoose from "mongoose";

// email ,phone no, name,password,wishlist,playlist,history

const playlistSchema=new mongoose.Schema({

},{timestamps:true})

export const Playlist=mongoose.model("Playlist",playlistSchema)