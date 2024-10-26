const {
  registerAirlineUseCase,
  loginUseCase,
  updateProfileUseCase,
  changePasswordUseCase,
} = require("../../application/useCases/airlineAuth");
const jwt = require("jsonwebtoken");

const registerAirline = async (req, res) => {
  try {
    const response = await registerAirlineUseCase(req.body, req.files);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    const response = await loginUseCase(req.body);
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const airlineId = req.user.userId;
    const updateAirline = req.body;
    const response = await updateProfileUseCase(airlineId, updateAirline);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

module.exports = {
  registerAirline,
  login,
  updateProfile,
  changePassword,
};
