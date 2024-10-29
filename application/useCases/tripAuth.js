const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const aircraftRepositary = require("../../infrastructure/repositaries/aircraftRepositary");
const airportRepositary = require("../../infrastructure/repositaries/airportRepositary");
const tripRepositary = require("../../infrastructure/repositaries/tripRepositary");
const moment = require("moment-timezone");

const addTripUseCase = async (id, tripdetails) => {
  const {
    departureAirport,
    arrivalAirport,
    aircraftModel,
    departureTime,
    arrivalTime,
    departureDate,
    arrivalDate,
  } = tripdetails;
  const airline = await userRepositary.findById(id);
  if (!airline) {
    throw new Error("No airline found");
  }
  const aircraft = await aircraftRepositary.findByModel(aircraftModel);
  if (!aircraft) {
    throw new Error("Aircraft Not found");
  }
  const depAirport = await airportRepositary.findByCode(departureAirport);
  const arrAirport = await airportRepositary.findByCode(arrivalAirport);
  if (!depAirport || !arrAirport) {
    throw new Error("Airport not found");
  }
  const fullDepartureDateTime = `${departureDate} ${departureTime}`;
  const fullArrivalDateTime = `${arrivalDate} ${arrivalTime}`;
  const departureMoment = moment(fullDepartureDateTime);
  const arrivalMoment = moment(fullArrivalDateTime);
  const convertedDepartureTime = moment
    .tz(fullDepartureDateTime, depAirport.timezone)
    .utc();
  const convertedArrivalTime = moment
    .tz(fullArrivalDateTime, arrAirport.timezone)
    .utc();
  const duration = moment.duration(arrivalMoment.diff(departureMoment));
  const durationHours = Math.floor(duration.asHours());
  const durationMinutes = duration.minutes();
  const newTrip = {
    ...tripdetails,
    airline: airline._id,
    departureTime: convertedDepartureTime,
    arrivalTime: convertedArrivalTime,
    departureAirport: depAirport._id,
    arrivalAirport: arrAirport._id,
    aircraft: aircraft._id,
    duration: `${durationHours}h ${durationMinutes}m`,
  };
  const saveTrip = tripRepositary.createTrip(newTrip);
  return saveTrip;
};

const getAllTripsUseCase = async (id) => {
  const airlineId = await userRepositary.findById(id);
  if (!airlineId) {
    throw new Error("Airline not found");
  }
  const trips = await tripRepositary.findAllTrips(id);
  return trips;
};

const deleteTripUseCase = async (id) => {
  const trip = await tripRepositary.deleteTrip(id);
  if (!trip) {
    throw new Error("Trip not found");
  }
  return { message: "Trip deleted Successfully" };
};

module.exports = {
  addTripUseCase,
  getAllTripsUseCase,
  deleteTripUseCase,
};
