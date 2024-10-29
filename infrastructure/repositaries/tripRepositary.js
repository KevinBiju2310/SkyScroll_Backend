const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    duration: {
      type: String,
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
    departureDate: {
      type: Date,
    },
    arrivalDate: {
      type: Date,
    },
    recurrenceType: {
      type: String,
    },
    recurringDays: {
      type: [String],
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
    .populate("airline")
    .populate("departureAirport")
    .populate("arrivalAirport")
    .populate("aircraft");
};

const deleteTrip = async (id) => {
  return await tripModel.findByIdAndDelete(id);
};

module.exports = {
  createTrip,
  findAllTrips,
  deleteTrip,
};
