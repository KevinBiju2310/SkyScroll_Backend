const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/register", userController.signUp);
router.post("/signin", userController.signIn);
router.get("/profile", verifyToken, userController.profileDetails);
router.put("/profile",verifyToken, userController.updateProfile);
// router.post('/verify-otp', userController.verifyOtp);

module.exports = router;
