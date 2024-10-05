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
  return { message: "Admin SignIn successfull", admin: admin };
};

const toggleBlockUseCase = async (userId) => {
  const user = await userRepositary.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.isVerified = !user.isVerified;
  await user.save();
  return { message: "User block status changed" };
};

module.exports = {
  signInUseCase,
  toggleBlockUseCase,
};
