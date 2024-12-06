const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tripController = require("../controllers/tripController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", userController.signUp);
router.post("/signin", userController.signIn);

router.post("/register-google", userController.googleSignUp);
router.post("/signin-google", userController.googleSignIn);

// router.get("/profile", verifyToken, userController.profileDetails);
router.put("/profile", verifyToken, userController.updateProfile);
router.put("/passport", verifyToken, userController.updatePassport);
// router.put("/profile/passport",verifyToken,userController.updatePassport);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);

router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/change-password", verifyToken, userController.changePassword);

router.get("/other-travellers", verifyToken, userController.getAllTravellers);
router.post("/other-travellers", verifyToken, userController.addTravellers);

router.get("/airports", userController.getAirports);
router.get("/search-flight", userController.searchFlight);
router.get("/flight/:id", tripController.getFlights);

router.post("/create-payment-intent", verifyToken, userController.Payments);
router.post("/create-booking", verifyToken, tripController.createBooking);

router.get("/bookings", verifyToken, tripController.getBooking);
router.get("/booked-airlines", verifyToken, userController.getBookedAirlines);
router.put("/cancelbooking/:id", verifyToken, userController.cancelBooking);

router.get("/wallet", verifyToken, userController.walletDetails);
router.get("/messages/:id", verifyToken, userController.getMessages);
router.get("/unread-messages", verifyToken, userController.getUnreadMessages);
// router.get("/last-unread-message", verifyToken, userController.getLastUnreadMessage);

router.post("/refresh-token", userController.getAccessToken);

module.exports = router;
