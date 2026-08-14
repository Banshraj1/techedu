import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";
import { Admin } from "../model/admin.model.js";
import { trusted } from "mongoose";
import jwt from "jsonwebtoken";

// further to improve this add OTP feature also
const registerAdmin = asyncHandler(async (req, res) => {
  const {
    adminname,
    email,
    phone = "1234567890",
    password,
    backupPassword,
  } = req.body;

  // ye wala block problem create kr rha hai

  // if ([adminname, email, phone, password].some((value) => !value?.trim())) {
  //   console.log("all fields are required");
  //   throw new ApiError(404, "All fields are required");
  // }
  console.log(adminname, email, phone, password, backupPassword);
  // TODO :: later check with phone no also
  const alreadyRegisteredAdmin = await Admin.findOne({ email: email }).select(
    "-password -backupPassword",
  );
  // console.log(alreadyRegisteredAdmin);
  if (alreadyRegisteredAdmin != null) {
    console.log("Admin with this email already registered");
    throw new ApiError(
      400,
      "Admin with this email already registered",
      alreadyRegisteredAdmin,
    );
    //   return res.status(409).json({
    //   success: false,
    //   message: "User with this email already exists",
    // });
  }
  const newAdmin = await Admin.create({
    adminname: adminname,
    email: email,
    phone: phone,
    password: password,
    backupPassword: backupPassword,
  });

  console.log(newAdmin);

  const response = await Admin.findById(newAdmin._id).select(
    "-password -backupPassword",
  );

  if (response == null) {
    throw new ApiError(501, "Something went wrong during user creation...");
  }
  // const result= response.body
  // console.log(response.body);
  console.log("Admin registered successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, response, "admin created successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  //abhi ke liye mai bs email se login kra rha hu baad me phone no se bhi hoga
  const { email, password, backupPassword } = req.body;
  // console.log(email, password, backupPassword);

  if ([email, password, backupPassword].some((value) => !value?.trim())) {
    throw new ApiError(404, "All fields are required");
  }

  const loggedinAdmin = await Admin.findOne({ email });
  if (!loggedinAdmin) {
    throw new ApiError(401, "Admin not found...");
  }
  // console.log(loggedinAdmin);

  const isPasswordCorrect = await loggedinAdmin.isPasswordCorrect(password);
  const isBackupPasswordCorrect =
    await loggedinAdmin.isBackupPasswordCorrect(backupPassword);

  if (isPasswordCorrect === null && isBackupPasswordCorrect === null) {
    throw new ApiError(402, "Invalid credentials...");
  }
  const accessToken = await loggedinAdmin.generateAcessToken();

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

  const response = await Admin.findById(loggedinAdmin._id).select(
    "-password -backupPassword",
  );
  console.log("log in successfull");

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, response, "logged in successfull"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken;
  // console.log(token);

  const SECRET_KEY = process.env.ACCESSTOKENSECRET;
  const isVerified = jwt.verify(token, SECRET_KEY);
  // console.log(isVerified);
  if (!isVerified) {
    throw new ApiError(404, "bad request");
  }
  const response = await Admin.findOne({ email: isVerified.email }).select(
    "-password -backupPassword",
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

const deleteAdmin = asyncHandler(async (req, res) => {
  //TODO: before deleting admin check if there is only one admin account is there in database or not if there is only one account then do not allow to delete that account otherwise there will be no admin left to manage the website and also check if the admin is trying to delete his own account or not if yes then do not allow to delete that account otherwise there will be no admin left to manage the website

  //get token verify get email then search for user in db and delete that ...

  const token = req.cookies.accessToken;
  // console.log(token);
  const SECRET_KEY = process.env.ACCESSTOKENSECRET;
  let { email, password, backupPassword } = req.body;
  if (!password) {
    throw new ApiError(400, "Password is required to delete user...");
  }
  if (!backupPassword) {
    throw new ApiError(400, "Backup Password is required to delete user...");
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
  const loggedinAdmin = await Admin.findOne({ email });
  if (loggedinAdmin === null) {
    throw new ApiError(401, "Admin not found...");
  }
  const isPasswordCorrect = await loggedinAdmin.isPasswordCorrect(password);
  const isBackupPasswordCorrect =
    await loggedinAdmin.isBackupPasswordCorrect(backupPassword);
  if (!isPasswordCorrect && !isBackupPasswordCorrect) {
    throw new ApiError(402, "Invalid credentials...");
  }

  const response = await Admin.deleteOne({ email });
  if (response.deletedCount == 0) {
    throw new ApiError(500, "Admin deletion failed...");
  }

  // console.log(response);

  return res
    .status(200)
    .cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, response, "Admin deleted successfully"));
});

//upar tk sb thik hai

export { registerAdmin, loginAdmin, logoutAdmin, deleteAdmin };
