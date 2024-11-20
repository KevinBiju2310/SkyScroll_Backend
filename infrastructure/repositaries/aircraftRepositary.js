const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
  seatNumber: String,
  type: String,
  status: String,
});

const seatingDetailsSchema = new mongoose.Schema({
  class: {
    type: String,
    enum: ["economy", "business", "first"],
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  windowPrice: {
    type: Number,
    required: true,
  },
  aislePrice: {
    type: Number,
    required: true,
  },
  middlePrice: {
    type: Number,
    required: true,
  },
  freeSeats: {
    type: Number,
    default: 0,
  },
  seats: [SeatSchema],
});

const AircraftSchema = new mongoose.Schema(
  {
    aircraftModel: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    yearOfManufacturer: {
      type: Number,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
    },
    engineManufacturer: {
      type: String,
      required: true,
    },
    engineModel: {
      type: String,
      required: true,
    },
    lastMaintenanceDate: {
      type: Date,
      required: true,
    },
    nextMaintenanceDate: {
      type: Date,
      required: true,
    },
    airworthinessCertificate: {
      type: String,
      required: true,
    },
    rows: {
      type: String,
      required: true,
    },
    columns: {
      type: String,
      required: true,
    },
    aisles: {
      type: String,
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    classConfig: {
      type: [String],
      enum: ["economy", "business", "first"],
      required: true,
    },
    seatingDetails: {
      type: [seatingDetailsSchema],
      required: true,
    },
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const aircraftModel = mongoose.model("Aircraft", AircraftSchema);

const createAircraft = async (aircraft) => {
  const newAircraft = new aircraftModel(aircraft);
  return await newAircraft.save();
};

const findAllAircrafts = async (id) => {
  return await aircraftModel.find({ airline: id });
};

const deleteAircraft = async (id) => {
  return await aircraftModel.findByIdAndDelete(id);
};

const findAllAircraftsAdmin = async () => {
  return await aircraftModel.find().populate("airline");
};

const findById = async (id) => {
  return await aircraftModel.findById(id);
};

const findByModel = async (model) => {
  return await aircraftModel.findOne({ aircraftModel: model });
};

const save = async (aircraft) => {
  return await aircraft.save();
};

module.exports = {
  createAircraft,
  findAllAircrafts,
  deleteAircraft,
  findAllAircraftsAdmin,
  findById,
  save,
  findByModel,
};
