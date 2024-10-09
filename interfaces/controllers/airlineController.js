const {
  registerAirlineUseCase,
} = require("../../application/useCases/airlineAuth");
// const uploadToCloudinary = require("../../infrastructure/utils/fileUpload");
// const cloudinary = require("../../infrastructure/services/cloudinaryConfig");
// const cloudinary = require("cloudinary").v2;

const registerAirline = async (req, res) => {
  try {
    const response = await registerAirlineUseCase(req.body, req.files);
    console.log(response);
    
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerAirline,
};
