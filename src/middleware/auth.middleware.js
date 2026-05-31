import express from "express";
import dotev from "dotenv";
import cookieParser from "cookie-parser";
import { asyncHandler, ApiError } from "../utils";
import { User } from "../model/user.model";
dotev.config();

export const verifyJwt = asyncHandler((req, res, next) => {
  try {
    const token = req?.accessToken;
    if(!token){
        throw new ApiError(404,"Access token not found")
    }
    const SECRET_KEY = process.env.ACCESSTOKENSECRET;
    const isVerified = jwt.verify(token, SECRET_KEY);

    // console.log(isVerified);

    if (!isVerified) {
      throw new ApiError(400, "unauthorised access");
    }

    const user = User.findById(isVerified._id);

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "something went wrong during jwt verification");
  }
});
