const bcrypt = require("bcryptjs");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const sendEmail = require("../../infrastructure/services/otpService");

const generateRandomPassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

const signInUseCase = async (userdata) => {
  const { email, password } = userdata;
  const admin = await userRepositary.findByEmail(email);
  if (!admin) {
    throw new Error("Email not found");
  }
  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    throw new Error("Password not found");
  }
  if (admin.role !== "admin") {
    throw new Error("Unauthorized. You are not an admin");
  }
  return admin;
};

const getUsersUseCase = async () => {
  const users = await userRepositary.getAllUsers();
  return users;
};

const toggleBlockUseCase = async (userId) => {
  const user = await userRepositary.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  return { message: "User block status changed" };
};

const getAirlineUseCase = async () => {
  const airlines = await userRepositary.getAllAirlines();
  return airlines;
};

const toggleAirlineStatusUseCase = async (airlineId) => {
  const airline = await userRepositary.findById(airlineId);
  if (!airline) {
    throw new Error("Airline not found");
  }
  airline.isVerified = !airline.isVerified;
  await airline.save();
  if (airline.isVerified && !airline.password) {
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    airline.password = hashedPassword;
    await airline.save();

    const subject = "Your account has been verified";
    const text = `Dear ${airline.username},\n\nYour account has been successfully verified. Here is your temporary password: ${randomPassword}\nPlease log in and change it immediately.\n\nBest regards,\nYour Company`;

    await sendEmail(airline.email, subject, text);
  }
  return { message: "airline Status Changed" };
};

module.exports = {
  signInUseCase,
  toggleBlockUseCase,
  getUsersUseCase,
  getAirlineUseCase,
  toggleAirlineStatusUseCase,
};
