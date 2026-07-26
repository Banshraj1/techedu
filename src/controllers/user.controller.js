import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";
import { User } from "../model/user.model.js";
import { trusted } from "mongoose";
import jwt from "jsonwebtoken";
// import { use } from "react";

/*
is file me vo controller rahega jo user pr perform hoga jaise update details like password login register history update ,playlist update, and create,token generation 
 */

// further to improve this add OTP feature also
const registerUser = asyncHandler(async (req, res) => {
  /*
    to check if required fields are present
    username, email, phone no, Password
    check if user already registered
    create a new user using USER MODEL 
    check if user generated successfully 
    return data after removing password from that

    */
  // console.log(req);

  //    console.log(req.body);

  const { username, email, phone = "1234567890", password } = req.body;

  // ye wala block problem create kr rha hai

  // if ([username, email, phone, password].some((value) => !value?.trim())) {
  //   console.log("all fields are required");
  //   throw new ApiError(404, "All fields are required");
  // }
  console.log(username, email, phone, password);
  // .select("-password")
  const alreadyRegisteredUser = await User.findOne({ email: email }).select(
    "-password",
  );

  // console.log(alreadyRegisteredUser);
  // console.log("email=",alreadyRegisteredUser.email);

  if (alreadyRegisteredUser != null) {
    console.log("User with this email already registered");
    throw new ApiError(
      400,
      "User with this email already registered",
      alreadyRegisteredUser,
    );
    //   return res.status(409).json({
    //   success: false,
    //   message: "User with this email already exists",
    // });
  }
  const newUser = await User.create({
    username: username,
    email: email,
    phone: phone,
    password: password,
  });

  console.log(newUser);

  const response = await User.findById(newUser._id).select("-password");

  if (response == null) {
    throw new ApiError(501, "Something went wrong during user creation...");
  }
  // const result= response.body
  // console.log(response.body);
  console.log("User registered successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, response, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //abhi ke liye mai bs email se login kra rha hu baad me phone no se bhi hoga
  const { email, password } = req.body;
  console.log(email, password);

  if ([email, password].some((value) => !value?.trim())) {
    throw new ApiError(404, "All fields are required");
  }
  const loggedinUser = await User.findOne({ email });
  if (!loggedinUser) {
    throw new ApiError(401, "User not found...");
  }
  // console.log(loggedinUser);

  const isPasswordCorrect = await loggedinUser.isPasswordCorrect(password);

  if (isPasswordCorrect === null) {
    throw new ApiError(402, "Invalid credentials...");
  }
  const accessToken = await loggedinUser.generateAcessToken();
  // console.log(accessToken);

  if (!accessToken) {
    throw new ApiError(500, "AccessToken generation Failed");
  }

  // below four lines are not required
  // this will give more control
  // using this we can REVOKE TOKEN, BLOCK USER and MANAGE SESSIONS

  // const accessTokenSaved = await loggedinUser.saveAccessToken(accessToken);
  // if (!accessTokenSaved) {
  //   throw new ApiError(500, "AccessToken saving failed");
  // }

  const response = await User.findById(loggedinUser._id).select("-password");
  console.log("log in successfull");

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, response, "logged in successfull"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken;
  // console.log(token);

  const SECRET_KEY = process.env.ACCESSTOKENSECRET;
  const isVerified = jwt.verify(token, SECRET_KEY);
  // console.log(isVerified);
  if (!isVerified) {
    throw new ApiError(404, "bad request");
  }
  const response = await User.findOne({ email: isVerified.email }).select(
    "-password",
  );
  console.log("log out successfull");

  return res
    .status(200)
    .cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, response, "logged out successfull"));
});

const deleteUser = asyncHandler(async (req, res) => {
  //get token verify get email then search for user in db and delete that ...

  const token = req.cookies.accessToken;
  // console.log(token);
  const SECRET_KEY = process.env.ACCESSTOKENSECRET;
  let { email, password } = req.body;
  if (!password) {
    throw new ApiError(400, "Password is required to delete user...");
  }

  // console.log(email,password,SECRET_KEY);

  // console.log(isVerified);
  if (!email) {
    const isVerified = await jwt.verify(token, SECRET_KEY);
    if (!isVerified) {
      throw new ApiError(
        404,
        "bad request.:: either email or sign in is required to delete user...",
      );
    }
    email = isVerified.email;
  }
  const loggedinUser = await User.findOne({ email });
  if (loggedinUser === null) {
    throw new ApiError(401, "User not found...");
  }
  const isPasswordCorrect = await loggedinUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(402, "Invalid credentials...");
  }

  const response = await User.deleteOne({ email });
  if (response.deletedCount == 0) {
    throw new ApiError(500, "User deletion failed...");
  }

  // console.log(response);

  if (response.deletedCount == 0) {
    throw new ApiError(500, "User deletion failed...");
  }

  return res
    .status(200)
    .cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, response, "User deleted successfully"));
});

//upar tk sb thik hai
const aboutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    console.log("user not found");
    throw new ApiError(404, "unauthorised access");
  }
  const response = await User.findById(user._id).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Used data found successfully"));
});

const expandWatchHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const { videoId } = req.params;
  // videos is an array
  if (!user) {
    throw new ApiError(404, "Unauthorised access::admin not found");
  }

  if (!videoId) {
    console.log("VideoId is must");
    throw new ApiError(404, "VideoId is must");
  }

  const response = await user.addInWatchHistory(videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        "Video added in watch history successfully",
      ),
    );
});

const compressWatchHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const { videoId } = req.params;
  // videos is an array
  if (!user) {
    throw new ApiError(404, "Unauthorised access::admin not found");
  }

  if (!videoId) {
    console.log("VideoId is must");
    throw new ApiError(404, "VideoId is must");
  }

  const response = await user.removeFromWatchHistory(videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        "Video removed from watch history successfully",
      ),
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  aboutUser,
  expandWatchHistory,
  compressWatchHistory,
};
