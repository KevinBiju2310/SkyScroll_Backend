const {
  signUpUseCase,
  signInUseCase,
  profileDetailsUseCase,
  updateProfileUseCase
} = require("../../application/useCases/userAuth");
// const verifyOtpUseCase = require("../../application/useCases/userAuth");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const response = await signUpUseCase(req.body);
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
    console.log(updatedUser.phone);
    console.log(updatedUser.dateofbirth);
    
    const response = await updateProfileUseCase(userId, updatedUser);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// const verifyOtp = async (req, res) => {
//   try {
//     const { phone, otp } = req.body;
//     const response = await verifyOtpUseCase(phone, otp);
//     res.status(200).json({ message: response.message });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

module.exports = {
  signUp,
  signIn,
  profileDetails,
  updateProfile,
};
