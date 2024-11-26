const mongoose = require("mongoose");

const SegmentSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
  },
  departureAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },
  arrivalAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },
  aircraft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aircraft",
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  departureTerminal: {
    type: String,
    required: true,
  },
  arrivalTerminal: {
    type: String,
    required: true,
  },
  departureGate: {
    type: String,
    required: true,
  },
  arrivalGate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "scheduled",
      "ontime",
      "delayed",
      "cancelled",
      "boarding",
      "inair",
      "landed",
    ],
    default: "scheduled",
    required: true,
  },
});

const TripSchema = new mongoose.Schema(
  {
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrices: {
      economy: {
        type: Number,
      },
      business: {
        type: Number,
      },
      firstClass: {
        type: Number,
      },
    },
    isDirect: {
      type: Boolean,
      required: true,
    },
    segments: {
      type: [SegmentSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const tripModel = mongoose.model("Trip", TripSchema);

const createTrip = async (data) => {
  const newTrip = new tripModel(data);
  return await newTrip.save();
};

const findAllTrips = async (id) => {
  return await tripModel
    .find({ airline: id })
    .populate("segments.departureAirport")
    .populate("segments.arrivalAirport")
    .populate("segments.aircraft");
};

const findById = async (id) => {
  return await tripModel
    .findById(id)
    .populate("airline")
    .populate("segments.departureAirport")
    .populate("segments.arrivalAirport")
    .populate("segments.aircraft");
};

const deleteTrip = async (id) => {
  return await tripModel.findByIdAndDelete(id);
};

const findAllTripsUser = async (filters) => {
  return await tripModel
    .find(filters)
    .populate("segments.departureAirport")
    .populate("segments.arrivalAirport")
    .populate("segments.aircraft")
    .populate("airline");
};

const findAllTripsAdmin = async () => {
  return await tripModel
    .find()
    .populate("segments.departureAirport")
    .populate("segments.arrivalAirport")
    .populate("segments.aircraft")
    .populate("airline");
};

const findTripsByAirlineId = async (id) => {
  return await tripModel.find({ airline: id }).select("_id");
};

const countTripsByAirline = async (id) => {
  return await tripModel.countDocuments({ airline: id });
};

module.exports = {
  createTrip,
  findAllTrips,
  deleteTrip,
  findAllTripsUser,
  findById,
  findAllTripsAdmin,
  findTripsByAirlineId,
  countTripsByAirline,
};
