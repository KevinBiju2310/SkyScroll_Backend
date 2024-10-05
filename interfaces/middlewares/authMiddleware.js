const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token using the same secret key used to sign the JWT
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
    req.user = decoded; // Store the decoded user info for future use
    console.log(decoded, "decoded")
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;
