import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({});
// import t
// email ,phone no, name,password,DOB,wishlist,playlist,history

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: email,
      index: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, "Size of Password should be atleast 8"],
    },
    whishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Playlist,
    },
    history: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Playlist,
    },
    playlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Playlist,
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
  }
  return next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAcessToken = async function () {
  return jwt.sign(
    {
      // username:this.username ,
      email: this.email,
      phone: this.phone,
    }, //data
    process.env.ACCESSTOKENSECRET, //secret key
    { algorithm: "RS256" }, //expiry
    {
      expiresIn: process.env.ACCESSTOKENEXPIRY,
    },
    function (err, token) {
      console.log(token);
    },
  );
};
export const User = mongoose.model("User", userSchema);
