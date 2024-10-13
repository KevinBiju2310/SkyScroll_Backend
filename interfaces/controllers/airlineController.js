const {
  registerAirlineUseCase,
  loginUseCase,
} = require("../../application/useCases/airlineAuth");
const jwt = require("jsonwebtoken");

const registerAirline = async (req, res) => {
  try {
    const response = await registerAirlineUseCase(req.body, req.files);
    console.log(response);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body)
    const response = await loginUseCase(req.body);
    const accessToken = jwt.sign(
      { userId: response.id, role: response.role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
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
      maxAge: 15 * 60 * 1000,
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

module.exports = {
  registerAirline,
  login,
};
