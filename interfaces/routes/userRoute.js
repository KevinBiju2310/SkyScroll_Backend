const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", userController.signUp);
router.post("/signin", userController.signIn);

router.post("/register-google",userController.googleSignUp)
router.post("/signin-google",userController.googleSignIn);

// router.get("/profile", verifyToken, userController.profileDetails);
router.put("/profile", verifyToken, userController.updateProfile);
// router.put("/profile/passport",verifyToken,userController.updatePassport);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp)

module.exports = router;
