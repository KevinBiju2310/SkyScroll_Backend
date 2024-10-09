const cloudinary = require("../services/cloudinaryConfig");
// const fs = require("fs");

const uploadToCloudinary = async (file, filename) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "airline_docs",
      public_id: filename,
      use_filename: true,
      unique_filename: false,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

module.exports = uploadToCloudinary;
