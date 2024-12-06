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

      const duration = moment.duration(
        convertedArrivalTime.diff(convertedDepartureTime)
      );
      if (duration.asMinutes() <= 0) {
        throw new Error("Arrival time must be after departure time");
      }
      const formattedDuration = `${Math.floor(
        duration.asHours()
      )}hr ${duration.minutes()}min`;
      console.log(`Segment Duration: ${formattedDuration}`);
      return {
        ...segment,
        aircraft: AircraftDoc._id,
        departureAirport: departureAirportDoc._id,
        arrivalAirport: arrivalAirportDoc._id,
        departureTime: convertedDepartureTime,
        arrivalTime: convertedArrivalTime,
        duration: formattedDuration,
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
  if (!findFlight) {
    throw new Error("flight not found");
  }
  const bookedSeats = await bookingRepositary.findSeatsById(id);
  const aggregatedSeats = bookedSeats.reduce((acc, booking) => {
    for (const [key, value] of booking.selectedSeats.entries()) {
      acc[key] = acc[key] ? [...acc[key], ...value] : value;
    }
    return acc;
  }, {});
  return {
    flightDetails: findFlight,
    bookedSeats: aggregatedSeats,
  };
};

const paymentsUseCase = async (details) => {
  const { amount } = details;
  // console.log(stripe);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    payment_method_types: ["card"],
  });
  // console.log(paymentIntent, "payments");
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

const updateTripUseCase = async (id, details) => {
  const findTrip = await tripRepositary.findById(id);
  if (!findTrip) {
    throw new Error("Trip not found");
  }
  const updatedTrip = await tripRepositary.updateTrip(id, details);
  return updatedTrip;
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
  updateTripUseCase,
};
