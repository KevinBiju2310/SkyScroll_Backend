const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const aircraftRepositary = require("../../infrastructure/repositaries/aircraftRepositary");
const airportRepositary = require("../../infrastructure/repositaries/airportRepositary");
const tripRepositary = require("../../infrastructure/repositaries/tripRepositary");
const bookingRepositary = require("../../infrastructure/repositaries/bookingRepositary");
const moment = require("moment-timezone");
const stripe = require("stripe")(
  "sk_test_51QKPOPDRGApPeaXHrjUCIUCB6vUC0kpjU6kV7Mj8Xh9bxQB50m0HKbzRZ6Br6RmosoY11EtXC5BuK0VSsXTjSJlI00mOfmvZrc"
);

const addTripUseCase = async (id, tripdetails) => {
  console.log(tripdetails);
  const { isDirect, segments } = tripdetails;
  if (isDirect && segments.length !== 1) {
    throw new Error("Direct flights must have exactly one segment");
  }
  if (!isDirect && segments.length < 2) {
    throw new Error("Connecting flights must have at least two segments");
  }
  const convertedSegments = await Promise.all(
    segments.map(async (segment) => {
      const {
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        aircraft,
      } = segment;
      console.log(departureTime);
      const AircraftDoc = await aircraftRepositary.findByModel(aircraft);
      const departureAirportDoc = await airportRepositary.findByName(
        departureAirport
      );
      const arrivalAirportDoc = await airportRepositary.findByName(
        arrivalAirport
      );
      if (!AircraftDoc) {
        throw new Error("Aircraft not found");
      }
      if (!departureAirportDoc || !arrivalAirportDoc) {
        throw new Error("Invalid departure or arrival airport");
      }
      const convertedDepartureTime = moment
        .tz(departureTime, departureAirportDoc.timezone)
        .utc();
      const convertedArrivalTime = moment
        .tz(arrivalTime, arrivalAirportDoc.timezone)
        .utc();
      return {
        ...segment,
        aircraft: AircraftDoc._id,
        departureAirport: departureAirportDoc._id,
        arrivalAirport: arrivalAirportDoc._id,
        departureTime: convertedDepartureTime,
        arrivalTime: convertedArrivalTime,
      };
    })
  );
  const tripData = {
    ...tripdetails,
    airline: id,
    segments: convertedSegments,
  };
  const saveTrip = await tripRepositary.createTrip(tripData);
  console.log(saveTrip);
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

const getFlightsUseCase = async (details) => {
  const { fromAirport, toAirport, departureDate, returnDate, tripType } =
    details;
  const deptAirport = await airportRepositary.findByName(fromAirport);
  const arrAirport = await airportRepositary.findByName(toAirport);
  if (!deptAirport || !arrAirport) {
    throw new Error("Airports not found");
  }
  const searchCriteria = {
    "segments.departureAirport": deptAirport._id,
    "segments.arrivalAirport": arrAirport._id,
    "segments.departureTime": {
      $gte: new Date(departureDate),
      $lt: new Date(
        new Date(departureDate).setDate(new Date(departureDate).getDate() + 1)
      ),
    },
  };
  if (tripType === "roundTrip" && returnDate) {
    const returnSearchCriteria = {
      "segments.departureAirport": arrAirport._id,
      "segments.arrivalAirport": deptAirport._id,
      "segments.departureTime": {
        $gte: new Date(returnDate),
        $lt: new Date(
          new Date(returnDate).setDate(new Date(returnDate).getDate() + 1)
        ),
      },
    };
    const outboundFlights = await tripRepositary.findAllTripsUser(
      searchCriteria
    );
    const returnFlights = await tripRepositary.findAllTripsUser(
      returnSearchCriteria
    );
    return { outboundFlights, returnFlights };
  } else {
    const outboundFlights = await tripRepositary.findAllTripsUser(
      searchCriteria
    );
    return { outboundFlights };
  }
};

const flightDetailsUseCase = async (details) => {
  const { id } = details;
  const findFlight = await tripRepositary.findById(id);
  return findFlight;
};

const paymentsUseCase = async (details) => {
  const { amount } = details;
  // console.log(stripe);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
  // console.log(paymentIntent);
  const clientSecret = paymentIntent.client_secret;
  return clientSecret;
};

const createBookingUseCase = async (details) => {
  // console.log(details)
  const { flightId, user, selectedSeats, travelClass } = details;
  const checkFlight = await tripRepositary.findById(flightId);
  if (!checkFlight) {
    throw new Error("Flight not found");
  }
  Object.entries(selectedSeats).forEach(([segmentIndex, seats]) => {
    const segment = checkFlight.segments[segmentIndex];
    if (!segment) {
      throw new Error(`Segment ${segmentIndex} not found for this flight.`);
    }
    const seatingDetails = segment.aircraft.seatingDetails.find(
      (s) => s.class.toLowerCase() === travelClass.toLowerCase()
    );
    if (!seatingDetails) {
      throw new Error(`Seating details for class ${travelClass} not found.`);
    }
    seats.forEach((seatNumber) => {
      const seat = seatingDetails.seats.find(
        (s) => s.seatNumber === seatNumber
      );
      console.log(seat, "Seat");
      if (seat) {
        seat.status = "booked";
      } else {
        throw new Error(
          `Seat ${seatNumber} not found in segment ${segmentIndex} for travel class ${travelClass}.`
        );
      }
    });
  });

  await checkFlight.save();
  const transformedData = {
    ...details,
    userId: user,
    paymentStatus: "SUCCESS",
    bookingStatus: "CONFIRMED",
  };
  console.log(transformedData);
  const saveBooking = await bookingRepositary.createBooking(transformedData);
  console.log(saveBooking);
};

const getAllBookingsUseCase = async (id) => {
  const allBookings = await bookingRepositary.findByUserId(id);
  return allBookings;
};

module.exports = {
  addTripUseCase,
  getAllTripsUseCase,
  deleteTripUseCase,
  getFlightsUseCase,
  flightDetailsUseCase,
  paymentsUseCase,
  createBookingUseCase,
  getAllBookingsUseCase,
};
