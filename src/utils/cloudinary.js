// import cloudinary from "cloudinary"
import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "./AsyncHandler";
import { ApiError } from "./ApiError";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path) => {
  try {
    if (!path) {
      console.log("Path not available");
      return new ApiError(501, "Path not available");
    }
    const response = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    console.log("File uploaded successfully");
    return response;
  } catch (error) {
    console.log("Error in uploading file", error);
    throw new ApiError(500, "Error in file uploading", error);
  }
};

export { uploadOnCloudinary };
