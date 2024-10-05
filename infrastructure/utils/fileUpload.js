const cloudinary = require("../services/cloudinaryConfig");
const fs = require("fs");

const Upload = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: "auto",
    });
    fs.unlinkSync(filePath);
    console.log(result.secure_url);
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload file to Cloudinary: " + error.message);
  }
};

module.exports = Upload;
