const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["SUCCESS", "FAILED", "REFUNDED", "PENDING"],
      default: "PENDING",
    },
    bookingStatus: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING"],
      default: "PENDING",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    travelClass: {
      type: String,
      required: true,
    },
    selectedSeats: {
      type: Map,
      of: [String],
    },
    passengers: [
      {
        fullName: {
          type: String,
          required: true,
        },
        gender: {
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
        passportNumber: {
          type: String,
          required: true,
        },
        passengerType: {
          type: String,
          enum: ["ADULT", "CHILD"],
          required: true,
        },
      },
    ],
    contactInfo: {
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

const createBooking = async (data) => {
  const newBooking = new bookingModel(data);
  return await newBooking.save();
};

const findByUserId = async (id) => {
  return await bookingModel.find({ userId: id }).populate({
    path: "flightId",
    populate: [
      {
        path: "segments.departureAirport",
        model: "Airport",
      },
      {
        path: "segments.arrivalAirport",
        model: "Airport",
      },
      {
        path: "segments.aircraft",
        model: "Aircraft",
      },
      {
        path: "airline",
        model: "User",
      },
    ],
  });
};

const findBookingsByTripId = async (id) => {
  return await bookingModel.find({ flightId: id }).populate({
    path: "flightId",
    populate: [
      {
        path: "segments.departureAirport segments.arrivalAirport",
        model: "Airport",
      },
    ],
  });
};

const findAllBookingsAdmin = async () => {
  return await bookingModel.find().populate([
    {
      path: "flightId",
      populate: [
        {
          path: "segments.departureAirport segments.arrivalAirport",
          model: "Airport",
        },
        {
          path: "airline",
          model: "User",
        },
      ],
    },
    {
      path: "userId",
      model: "User",
    },
  ]);
};

const changeStatus = async (id, status) => {
  return await bookingModel.findByIdAndUpdate(
    id,
    { bookingStatus: status },
    { new: true }
  );
};

const revenueCalculate = async () => {
  return await bookingModel.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
};

const getMonthlyRevenue = async () => {
  return await bookingModel.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$bookingDate" },
          year: { $year: "$bookingDate" },
        },
        revenue: { $sum: "$totalAmount" },
        users: { $addToSet: "$userId" },
        airlines: { $addToSet: "$flightId" },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        revenue: 1,
        userCount: { $size: "$users" },
        airlineCount: { $size: "$airlines" },
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);
};

const findBookedAirlines = async (id) => {
  return await bookingModel.find({ userId: id }).populate({
    path: "flightId",
    populate: [
      {
        path: "airline",
        model: "User",
      },
    ],
  });
};

const findUserIdByTripId = async (id) => {
  return await bookingModel.find({ flightId: { $in: id } }).populate("userId");
};

const findById = async (id) => {
  return await bookingModel.findById(id);
};

const saveBooking = async (data) => {
  const updatedBooking = await data.save();
  return updatedBooking;
};

const countBookingsByAirline = async (id) => {
  return await bookingModel
    .aggregate([
      {
        $lookup: {
          from: "trips",
          localField: "flightId",
          foreignField: "_id",
          as: "flight",
        },
      },
      {
        $unwind: "$flight",
      },
      {
        $match: {
          "flight.airline": new mongoose.Types.ObjectId(id),
        },
      },
      {
        $count: "totalBookings",
      },
    ])
    .then((result) => {
      if (result.length === 0) return 0;
      return result[0].totalBookings;
    });
};

const findSeatsById = async (id) => {
  return await bookingModel.find({ flightId: id }).select("selectedSeats");
};

module.exports = {
  createBooking,
  findByUserId,
  findBookingsByTripId,
  findAllBookingsAdmin,
  changeStatus,
  revenueCalculate,
  getMonthlyRevenue,
  findBookedAirlines,
  findUserIdByTripId,
  findById,
  saveBooking,
  countBookingsByAirline,
  findSeatsById,
};
