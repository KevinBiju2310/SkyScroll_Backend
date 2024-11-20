const {
  addTripUseCase,
  getAllTripsUseCase,
  deleteTripUseCase,
  flightDetailsUseCase,
  createBookingUseCase,
  getAllBookingsUseCase
} = require("../../application/useCases/tripAuth");

const addTrips = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId, req.body);
    const response = await addTripUseCase(userId, req.body);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await getAllTripsUseCase(userId);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTrips = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteTripUseCase(id);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFlights = async (req, res) => {
  try {
    const response = await flightDetailsUseCase(req.params);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const response = await createBookingUseCase(req.body);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await getAllBookingsUseCase(userId);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addTrips,
  getAllTrips,
  deleteTrips,
  getFlights,
  createBooking,
  getBooking,
};
