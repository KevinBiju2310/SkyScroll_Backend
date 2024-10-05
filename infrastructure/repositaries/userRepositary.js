const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin", "airline"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    airlineName: {
      type: String,
    },
    iataCode: {
      type: String,
    },
    airlineWebsite: {
      type: String,
    },
    country: {
      type: String,
    },
    designation: {
      type: String,
    },
    licenseDocument: {
      type: String,
    },
    insuranceDocument: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", UserSchema);

const createUser = async (user) => {
  const newUser = new userModel(user);
  return await newUser.save();
};

const findByEmail = async (email) => {
  return await userModel.findOne({ email });
};

const findById = async (id) => {
  return await userModel.findById(id);
};

const profileDetail = async () => {
  return await userModel.find();
};

const updateUserProfile = async (id, data) => {
  return await userModel.findByIdAndUpdate(id, { $set: data });
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  profileDetail,
  updateUserProfile
};
