const mongoose = require("mongoose");

const PassportSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  nationality: {
    type: String,
  },
  passportNumber: {
    type: String,
  },
  expiryDate: {
    type: Date,
  },
});

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
    otp: {
      type: Number,
    },
    otpExpire: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin", "airline"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
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
    googleUser: {
      type: Boolean,
      default: false,
    },
    passportDetails: PassportSchema,
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

const getAllUsers = async () => {
  return await userModel.find({ role: "user" });
};

const deleteUser = async (id) => {
  return await userModel.findByIdAndDelete(id);
};

const getAllAirlines = async () => {
  return await userModel.find({ role: "airline" });
};

const save = async (user) => {
  return await user.save();
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  profileDetail,
  updateUserProfile,  
  getAllUsers,
  deleteUser,
  getAllAirlines,
  save,
};
