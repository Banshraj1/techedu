import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  console.log(username, email, phone, password);
  if ([username, email, phone, password].some((value) => !value?.trim())) {
    // console.log("all fields are required");
    throw new ApiError(404, "All fields are required");
  }
  // .select("-password")
  const alreadyRegisteredUser = await User.findOne({ email: email }).select(
    "-password",
  );
  console.log(alreadyRegisteredUser.body);

  if (alreadyRegisteredUser) {
    throw new ApiError(
      400,
      "User with this email already registered in db ",
      alreadyRegisteredUser,
    );
  }
  const newUser = await User.create({
    username: username,
    email: email,
    phone: phone,
    password: password,
  });

  console.log(newUser);

  const response = User.findById(newUser._id).select("-password");
  if (!response) {
    throw new ApiError(501, "Something went wrong during user creation...");
  }
  // const result= response.body
  // console.log(response.body);

  return res.status(200).json(response);
});

export { registerUser };
