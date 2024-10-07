const bcrypt = require("bcryptjs");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");

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

module.exports = {
  signInUseCase,
  toggleBlockUseCase,
  getUsersUseCase,
};
