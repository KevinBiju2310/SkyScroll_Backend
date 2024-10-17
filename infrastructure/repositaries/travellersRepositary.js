const mongoose = require("mongoose");

const TravellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    passportNumber: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const travellersModel = mongoose.model("OtherTraveller", TravellerSchema);

const findByPassportNumber = async (passportNumber) => {
  return await travellersModel.findOne({ passportNumber });
};

const createTraveller = (traveller) => {
  return new travellersModel(traveller);
};

const saveTraveller = async (traveller) => {
  return await traveller.save();
};

const getAllTravellers = async () => {
  return await travellersModel.find();
};

module.exports = {
  findByPassportNumber,
  createTraveller,
  saveTraveller,
  getAllTravellers,
};
