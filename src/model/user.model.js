// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config({});
// import { Playlist } from "./playlist.model.js";

// // email ,phone no, name,password,DOB,wishlist,playlist,history

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       index: true,
//       required: true,
//     },
//     phone: {
//       type: Number,
//       required: true,
//     },
//     //DOB: {
//     //  type: Date,
//     //  required: true,
//     //},
//     password: {
//       type: String,
//       required: true,
//       min: [8, "Size of Password should be atleast 8"],
//     },
//     whishlist: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: Playlist,
//     },
//     history: {
//       // to make sure user want to store his history
//       type: Boolean,
//       default: true,
//     },
//     watchHistory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: Playlist,
//     },
//     playlist: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: Playlist,
//     },
//   },
//   { timestamps: true },
// );
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   return next;
// });

// userSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// userSchema.methods.generateAcessToken = async function () {
//   return jwt.sign(
//     {
//       // username:this.username ,
//       email: this.email,
//       phone: this.phone,
//     }, //data
//     process.env.ACCESSTOKENSECRET, //secret key
//     {
//       //expiry
//       expiresIn: process.env.ACCESSTOKENEXPIRY,
//     },
//   );

//   // return accessToken;
// };

// // this method will give more control
// // using this we can REVOKE TOKEN, BLOCK USER and MANAGE SESSIONS

// userSchema.methods.saveAccessToken = async function (token) {
//   this.accessToken = token;
//   return this.save();
// };
// userSchema.methods.addInWatchHistory = function (videoId) {
//   this.watchHistory.push(videoId);
//   return this.save();
// };
// userSchema.methods.removeFromWatchHistory = function (videoId) {
//   this.watchHistory = this.watchHistory.filter((elem) => elem._id != videoId);
//   return this.save();
// };

// export const User = mongoose.model("User", userSchema);
