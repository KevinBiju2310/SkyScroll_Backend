const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const travellersRepositary = require("../../infrastructure/repositaries/travellersRepositary");
const bookingRepositary = require("../../infrastructure/repositaries/bookingRepositary");
const walletRepositary = require("../../infrastructure/repositaries/walletRepositary");
const sendEmail = require("../../infrastructure/services/otpService");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Conversation = require("../../infrastructure/repositaries/messageRepositary");

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
  await sendEmail(saveUser.email, "Your OTP Code", "otp", otp);
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

const updatePassportUseCase = async (id, updatedData) => {
  const user = await userRepositary.findById(id);
  console.log(user, "user-data");
  if (!user) {
    throw new Error("User not found");
  }
  const updatedPassportDetails = {
    passportDetails: {
      firstName: updatedData.firstName || user.passportDetails?.firstName,
      lastName: updatedData.lastName || user.passportDetails?.lastName,
      dateOfBirth: updatedData.dateOfBirth || user.passportDetails?.dateOfBirth,
      nationality: updatedData.nationality || user.passportDetails?.nationality,
      passportNumber:
        updatedData.passportNumber || user.passportDetails?.passportNumber,
      expiryDate: updatedData.expiryDate || user.passportDetails?.expiryDate,
    },
  };
  console.log(updatedPassportDetails);
  const updatedPassport = await userRepositary.updateUserProfile(
    id,
    updatedPassportDetails
  );
  console.log(updatedPassport, "passport-dta");
  return updatedPassport;
};

const verifyOtpUseCase = async (userId, otp) => {
  const user = await userRepositary.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const currentTime = new Date().getTime();

  if (!user.otpExpire || currentTime > new Date(user.otpExpire).getTime()) {
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    throw new Error("OTP expired. Please request a new one.");
  }

  otp = Number(otp);

  if (user.otp !== otp) {
    throw new Error("Invalid OTP. Please try again.");
  }
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

  const newOtp = Math.floor(100000 + Math.random() * 900000);
  const otpExpire = new Date(new Date().getTime() + 60 * 1000);

  user.otp = newOtp;
  user.otpExpire = otpExpire;
  await user.save();
  return "New OTP sent successfully";
};

const googleSignUpUseCase = async (googleDetails) => {
  const { token } = googleDetails;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, name } = payload;
  const existingUser = await userRepositary.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already in use.");
  }
  user = { username: name, email, googleUser: true };
  const saveUser = await userRepositary.createUser(user);
  return saveUser;
};

const googleSignInUseCase = async (googleDetails) => {
  const { token } = googleDetails;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email } = payload;
  const user = await userRepositary.findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.isBlocked) {
    throw new Error("User is Blocked");
  }
  return user;
};

const forgotPasswordUseCase = async (emailDetails) => {
  const { email } = emailDetails;
  const user = await userRepositary.findByEmail(email);
  console.log(user.email, "user case");
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role === "airline" && !user.isVerified) {
    throw new Error("Only verified airline users can reset their password.");
  }
  const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  await sendEmail(
    user.email,
    "Password Reset Request",
    "passwordReset",
    resetLink
  );
  console.log(resetLink, "Reset-link");
  return { message: "Password reset link sent to email" };
};

const resetPasswordUseCase = async (passwordDetails) => {
  const { token, newPassword } = passwordDetails;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userRepositary.findByEmail(decoded.email);
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await userRepositary.save(user);
  return { message: "Password updated successfully" };
};

const changePasswordUseCase = async (id, passwords) => {
  const { currentPassword, newPassword } = passwords;
  const user = await userRepositary.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    throw new Error("Current Password is incorrect");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await userRepositary.save(user);
  return { message: "Password successfully changed" };
};

const addTravellersUseCase = async (userId, travellerDetails) => {
  const { passportNumber } = travellerDetails;
  const existingPassportNumber =
    await travellersRepositary.findByPassportNumber(passportNumber);
  if (existingPassportNumber) {
    throw new Error("Passport Number is Incorrect");
  }
  travellerDetails.userId = userId;
  const createTraveller =
    travellersRepositary.createTraveller(travellerDetails);
  const saveTraveller = await travellersRepositary.saveTraveller(
    createTraveller
  );
  return { message: "Traveller created successfully", saveTraveller };
};

const getAllTravellersUseCase = async (id) => {
  const travellers = await travellersRepositary.getAllTravellers(id);
  return travellers;
};

const getBookedAirlinesUseCase = async (id) => {
  const bookedAirlines = await bookingRepositary.findBookedAirlines(id);
  const onlyAirlines = bookedAirlines.map(
    (booking) => booking.flightId.airline
  );
  const uniqueAirlines = onlyAirlines.filter(
    (airline, index, self) =>
      index ===
      self.findIndex((a) => a._id.toString() === airline._id.toString())
  );
  return uniqueAirlines;
};

const cancelBookingUseCase = async (id) => {
  const findBooking = await bookingRepositary.findById(id);
  if (!findBooking) {
    throw new Error("Booking Id not found");
  }
  findBooking.bookingStatus = "CANCELLED";
  findBooking.paymentStatus = "REFUNDED";
  const updatedBooking = await bookingRepositary.saveBooking(findBooking);
  const refundAmount = findBooking.totalAmount;
  let userWallet = await walletRepositary.findByUserId(findBooking.userId);
  if (!userWallet) {
    const newWallet = {
      userId: findBooking.userId,
      balance: refundAmount,
      transactions: [
        {
          amount: refundAmount,
        },
      ],
    };
    userWallet = await walletRepositary.createWallet(newWallet);
  } else {
    userWallet.balance += refundAmount;
    userWallet.transactions.push({
      amount: refundAmount,
    });

    await walletRepositary.updateWallet(userWallet._id, {
      balance: userWallet.balance,
      transactions: userWallet.transactions,
    });
  }
  return updatedBooking;
};

const walletDetailsUseCase = async (id) => {
  const walletDetails = await walletRepositary.findByUserId(id);
  return walletDetails;
};

const messageUseCase = async (senderId, receiverId) => {
  const conversation = await Conversation.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  });
  if (conversation) {
    return conversation.messages;
  } else {
    return [];
  }
};

module.exports = {
  signUpUseCase,
  signInUseCase,
  profileDetailsUseCase,
  updateProfileUseCase,
  updatePassportUseCase,
  verifyOtpUseCase,
  resendOtpUseCase,
  googleSignUpUseCase,
  googleSignInUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  changePasswordUseCase,
  addTravellersUseCase,
  getAllTravellersUseCase,
  getBookedAirlinesUseCase,
  cancelBookingUseCase,
  walletDetailsUseCase,
  messageUseCase,
};
