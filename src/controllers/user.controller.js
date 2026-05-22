import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { trusted } from "mongoose";

/*
is file me vo controller rahega jo user pr perform hoga jaise update details like password login register history update ,playlist update, and create,token generation 
 */

// furter to improve this add OTP feature also
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
  const { username, email, phone, password } = req.body;

  // console.log(username, email, phone, password);
  if ([username, email, phone, password].some((value) => !value?.trim())) {
    // console.log("all fields are required");
    throw new ApiError(404, "All fields are required");
  }
  // .select("-password")
  const alreadyRegisteredUser = await User.findOne({ email: email }).select(
    "-password",
  );

  //   console.log(alreadyRegisteredUser);
  //   console.log("email=",alreadyRegisteredUser.email);

  if (alreadyRegisteredUser != null) {
    throw new ApiError(
      400,
      "User with this email already registered",
      alreadyRegisteredUser,
    );
  }
  const newUser = await User.create({
    username: username,
    email: email,
    phone: phone,
    password: password,
  });

  // console.log(newUser);

  const response = await User.findById(newUser._id).select("-password");

  if (response == null) {
    throw new ApiError(501, "Something went wrong during user creation...");
  }
  // const result= response.body
  // console.log(response.body);

  return res
    .status(200)
    .json(new ApiResponse(200, response, "user created successfully"));
});
//upar tk sb thik hai

const loginUser = asyncHandler(async (req, res) => {
  //abhi ke liye mai bs email se login kra rha hu baad me phone no se bhi hoga
  const { email, password } = req.body;
  if ([email, password].some((value) => !value?.trim())) {
    throw new ApiError(404, "All fields are required");
  }
  const loggedinUser = await User.findOne({ email });
  if (!loggedinUser) {
    throw new ApiError(401, "User not found...");
  }
  // console.log(loggedinUser);

  const isPasswordCorrect = await loggedinUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(402, "Invalid credentials...");
  }
  console.log("here");
  const accessToken = await loggedinUser.generateAcessToken;
  console.log(accessToken);

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

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 *7,
    })
    .json(new ApiResponse(200, response, "logged in successfull"));
});

export { registerUser, loginUser };
