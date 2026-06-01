import express from "express";
import dotev from "dotenv";
import cookieParser from "cookie-parser";
import { asyncHandler, ApiError } from "../utils/index.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
dotev.config({});

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    // console.log(req);
    const token = req?.cookies.accessToken;

    // console.log(token);

    if (!token) {
      throw new ApiError(404, "Access token not found");
    }
    const SECRET_KEY = process.env.ACCESSTOKENSECRET;
    const isVerified = await jwt.verify(token, SECRET_KEY);

    // console.log(isVerified);

    if (!isVerified) {
      throw new ApiError(400, "unauthorised access");
    }

    const user = await User.findOne({ email: isVerified.email }).select(
      "-password",
    );
    // console.log(user);

    req.user = user;
    console.log("jwt verification successfull");

    next();
  } catch (error) {
    throw new ApiError(400, "something went wrong during jwt verification");
  }
});
