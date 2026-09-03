// import cloudinary from "cloudinary"
import { v2 as cloudinary } from "cloudinary";
import { asyncHandler, ApiError } from "./index.js";
import dotenv from "dotenv";
import path from "path";
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
    console.log("cloudinary::File uploaded successfully");
    return response;
  } catch (error) {
    console.log("Error in uploading file", error);
    throw new ApiError(500, "Error in file uploading", error);
  }
};

const deleteFromCloudinary = async (publicId, resource_type = "auto") => {
  try {
    if (!publicId) {
      console.log("Public ID not available");
      return new ApiError(501, "Public ID not available");
    }
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type,
    });
    console.log("cloudinary::File deleted successfully");
    return response;
  } catch (error) {
    console.log("Error in deleting file", error);
    throw new ApiError(500, "Error in file deleting", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
