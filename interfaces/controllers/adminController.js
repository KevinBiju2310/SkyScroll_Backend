const {
  signInUseCase,
  toggleBlockUseCase,
  getUsersUseCase,
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

module.exports = {
  signIn,
  toggleBlock,
  getUsers,
};
