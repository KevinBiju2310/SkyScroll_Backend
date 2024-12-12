const jwt = require("jsonwebtoken");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log(token, "token-established");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    const user = await userRepositary.findById(req.user.userId);
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

const verifyTokenAirline = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    console.log(decoded);
    if (decoded.role !== "airline") {
      return res.status(403).json({ message: "Access denied. Airlines only" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAdmin,
  verifyTokenAirline,
};
