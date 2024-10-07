const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  // console.log(token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token using the same secret key used to sign the JWT
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
    req.user = decoded; // Store the decoded user info for future use
    console.log(decoded, "decoded");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies.refreshToken;
  console.log(token, "tokenfor Admin");
  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
    req.user = decoded;

    // Check if the user role is 'admin'
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    // If the user is admin, proceed to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAdmin,
};
