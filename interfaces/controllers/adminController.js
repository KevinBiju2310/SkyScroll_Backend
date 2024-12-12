const {
  signInUseCase,
  toggleBlockUseCase,
  getUsersUseCase,
  getAirlineUseCase,
  toggleAirlineStatusUseCase,
  getAllBookingsUseCase,
  getAllTripsUseCase,
  getDashboardDetailsUseCase,
} = require("../../application/useCases/adminAuth");
const jwt = require("jsonwebtoken");

const signIn = async (req, res) => {
  try {
    const response = await signInUseCase(req.body);
    console.log(response);
    const accessToken = jwt.sign(
      { userId: response.id, role: response.role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { userId: response.id, role: response.role },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    console.log(accessToken);
    console.log(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await getUsersUseCase();
    console.log(response, "All Users");
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const toggleBlock = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await toggleBlockUseCase(userId);
    res.status(201).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAirlines = async (req, res) => {
  try {
    const response = await getAirlineUseCase();
    console.log(response, "All Airlines");
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const toggleAirlineStatus = async (req, res) => {
  try {
    const airlineId = req.params.id;
    const response = await toggleAirlineStatusUseCase(airlineId);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const response = await getAllBookingsUseCase();
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const response = await getAllTripsUseCase();
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getDashboardDetails = async (req, res) => {
  try {
    const response = await getDashboardDetailsUseCase();
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  signIn,
  toggleBlock,
  getUsers,
  getAirlines,
  toggleAirlineStatus,
  getAllBookings,
  getAllTrips,
  getDashboardDetails,
};
