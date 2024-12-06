const mongoose = require("mongoose");

const GateSchema = new mongoose.Schema({
  gateNumber: {
    type: String,
    required: true,
  },
});

const TerminalSchema = new mongoose.Schema({
  terminalName: {
    type: String,
    required: true,
  },
  gates: [GateSchema],
});

const AirportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  timezone: {
    type: String,
  },
  longitude: {
    type: Number,
    required: true,
  },
  terminals: [TerminalSchema],
});

const airportModel = mongoose.model("Airport", AirportSchema);

const createAirport = async (airportData) => {
  const newAirport = new airportModel(airportData);
  return await newAirport.save();
};

const getAllAirports = async () => {
  return await airportModel.find();
};

const findByName = async (name) => {
  return await airportModel.findOne({ name });
};

const findById = async (id) => {
  return await airportModel.findById(id);
};

const findByCode = async (code) => {
  return await airportModel.findOne({ code });
};

const updateAirport = async (airportId, airportData) => {
  return await airportModel.findByIdAndUpdate(airportId, airportData);
};

const deleteAirport = async (airportId) => {
  await airportModel.findByIdAndDelete(airportId);
};

const countAirports = async () => {
  return await airportModel.countDocuments();
};

const findName = async (name) => {
  return await airportModel.findOne({ name: name });
};

module.exports = {
  createAirport,
  getAllAirports,
  updateAirport,
  deleteAirport,
  findByName,
  findById,
  findByCode,
  countAirports,
  findName,
};
