import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({});
import { Playlist } from "./playlist.model.js";

// email ,phone no, name,password,DOB,wishlist,playlist,history

const adminSchema = new mongoose.Schema(
  {
    adminname: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    DOB: {
      type: Date,
    //   required: true,
    },
    password: {
      type: String,
      required: true,
      min: [12, "Size of Password should be atleast 12"],
    },
    backupPassword: {
      type: String,
      required: true,
      min: [20, "Size of Password should be atleast 20"],
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true },
);
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified("backupPassword")) {
    this.backupPassword = await bcrypt.hash(this.backupPassword, 15);
  }
  return next;
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
adminSchema.methods.isBackupPasswordCorrect = async function (backupPassword) {
  return await bcrypt.compare(backupPassword, this.backupPassword);
};

//TODO create a dfferent secrete key for admin
adminSchema.methods.generateAcessToken = async function () {
  return jwt.sign(
    {
      // adminname:this.adminname ,
      email: this.email,
      phone: this.phone,
      _id: this._id,
    }, //data
    process.env.ACCESSTOKENSECRET, //secret key
    {
      //expiry
      expiresIn: process.env.ACCESSTOKENEXPIRY,
    },
  );

  // return accessToken;
};

// this method will give more control
// using this we can REVOKE TOKEN, BLOCK USER and MANAGE SESSIONS

adminSchema.methods.saveAccessToken = async function (token) {
  return (this.accessToken = token);
};

export const Admin = mongoose.model("Admin", adminSchema);
