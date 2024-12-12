const {
  signUpUseCase,
  signInUseCase,
  profileDetailsUseCase,
  updateProfileUseCase,
  verifyOtpUseCase,
  resendOtpUseCase,
  googleSignUpUseCase,
  googleSignInUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  changePasswordUseCase,
  addTravellersUseCase,
  getAllTravellersUseCase,
  updatePassportUseCase,
  getBookedAirlinesUseCase,
  cancelBookingUseCase,
  walletDetailsUseCase,
  messageUseCase,
  unreadMessagesUseCase,
  // lastUnreadMessageUseCase,
} = require("../../application/useCases/userAuth");
const {
  getAirportsUseCase,
} = require("../../application/useCases/airportAuth");
const {
  getFlightsUseCase,
  paymentsUseCase,
} = require("../../application/useCases/tripAuth");
// const verifyOtpUseCase = require("../../application/useCases/userAuth");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const response = await signUpUseCase(req.body);
    console.log(response);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const response = await signInUseCase(req.body);
    const accessToken = jwt.sign(
      { userId: response.id },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: response.id },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    console.log(accessToken);
    console.log(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const profileDetails = async (req, res) => {
  try {
    const response = await profileDetailsUseCase(req.user.userId);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updatedUser = req.body;
    const response = await updateProfileUseCase(userId, updatedUser);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePassport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updatedPassport = req.body;
    console.log(updatedPassport, "coming");
    const response = await updatePassportUseCase(userId, updatedPassport);
    console.log(response, "from front");
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const response = await verifyOtpUseCase(userId, otp);
    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully!", response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const response = await resendOtpUseCase(userId);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const googleSignUp = async (req, res) => {
  try {
    const response = await googleSignUpUseCase(req.body);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const googleSignIn = async (req, res) => {
  try {
    const response = await googleSignInUseCase(req.body);
    const accessToken = jwt.sign(
      { userId: response.id },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: response.id },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    console.log(accessToken);
    console.log(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    console.log(req.body);
    const response = await forgotPasswordUseCase(req.body);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const response = await resetPasswordUseCase(req.body);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwords = req.body;
    const response = await changePasswordUseCase(userId, passwords);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const addTravellers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await addTravellersUseCase(userId, req.body);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAllTravellers = async (req, res) => {
  try {
    const id = req.user.userId;
    const response = await getAllTravellersUseCase(id);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(404).json({ message: "Refresh token not found" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Access token refreshed" });
  });
};

const getAirports = async (req, res) => {
  try {
    const response = await getAirportsUseCase();
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const searchFlight = async (req, res) => {
  try {
    const response = await getFlightsUseCase(req.query);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const Payments = async (req, res) => {
  try {
    const response = await paymentsUseCase(req.body);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getBookedAirlines = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await getBookedAirlinesUseCase(userId);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await cancelBookingUseCase(id);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const walletDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await walletDetailsUseCase(userId);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;
    const response = await messageUseCase(senderId, receiverId);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getUnreadMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await unreadMessagesUseCase(userId);
    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// const getLastUnreadMessage = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const response = await lastUnreadMessageUseCase(userId);
//     res.status(201).json({ success: true, response });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

module.exports = {
  signUp,
  signIn,
  profileDetails,
  updateProfile,
  updatePassport,
  verifyOtp,
  resendOtp,
  googleSignUp,
  googleSignIn,
  forgotPassword,
  resetPassword,
  changePassword,
  addTravellers,
  getAllTravellers,
  getAccessToken,
  getAirports,
  searchFlight,
  Payments,
  getBookedAirlines,
  cancelBooking,
  walletDetails,
  getMessages,
  getUnreadMessages,
  // getLastUnreadMessage,
};
