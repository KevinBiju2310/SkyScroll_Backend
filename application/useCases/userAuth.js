const bcrypt = require("bcryptjs");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const sendEmail = require("../../infrastructure/services/otpService");

const signUpUseCase = async (userdata) => {
  const { email, password } = userdata;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const existingUser = await userRepositary.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already in use.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  userdata.password = hashedPassword;
  const saveUser = await userRepositary.createUser(userdata);
  const otpExpire = new Date(new Date().getTime() + 60 * 1000);
  saveUser.otp = otp;
  saveUser.otpExpire = otpExpire;
  await saveUser.save();
  await sendEmail(saveUser.email, "Your OTP Code", `Your otp is ${otp}`);
  console.log(otp);
  return saveUser;
};

const signInUseCase = async (userdata) => {
  const { email, password } = userdata;
  const user = await userRepositary.findByEmail(email);
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!user || !passwordMatch) {
    throw new Error("Incorrect Email or password");
  }
  if (user.isBlocked) {
    throw new Error("User is Blocked");
  }
  return user;
};

const profileDetailsUseCase = async (id) => {
  const user = await userRepositary.findById(id);
  return user;
};

const updateProfileUseCase = async (id, updatedData) => {
  const updatedUser = await userRepositary.updateUserProfile(id, updatedData);
  return updatedUser;
};

const verifyOtpUseCase = async (userId, otp) => {
  const user = await userRepositary.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const currentTime = new Date().getTime();
  
  // Check if OTP has expired
  if (!user.otpExpire || currentTime > new Date(user.otpExpire).getTime()) {
    user.otp = null; // Clear the OTP if it has expired
    user.otpExpire = null;
    await user.save();
    throw new Error("OTP expired. Please request a new one.");
  }

  otp = Number(otp); // Ensure OTP is a number

  // Check if the provided OTP matches
  if (user.otp !== otp) {
    throw new Error("Invalid OTP. Please try again.");
  }

  // OTP is valid, mark user as verified and clear the OTP and expiration
  user.isVerified = true;
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  return user;
};



const resendOtpUseCase = async (userId) => {
  const user = await userRepositary.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Generate a new OTP and set a new expiration time (e.g., 60 seconds from now)
  const newOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const otpExpire = new Date(new Date().getTime() + 60 * 1000); // 60 seconds from now

  user.otp = newOtp;
  user.otpExpire = otpExpire;
  await user.save();

  // Send OTP to user (via email/SMS)
  // ...

  return "New OTP sent successfully";
};






module.exports = {
  signUpUseCase,
  signInUseCase,
  profileDetailsUseCase,
  updateProfileUseCase,
  verifyOtpUseCase,
  resendOtpUseCase
};
