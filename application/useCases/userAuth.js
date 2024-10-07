const bcrypt = require("bcryptjs");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");
// const otpService = require("../../infrastructure/services/otpService");
// const generateOTP = require("../../infrastructure/utils/generateOTP")

const signUpUseCase = async (userdata) => {
  const { email, password } = userdata;
  const existingUser = await userRepositary.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already in use.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  userdata.password = hashedPassword;
  const saveUser = await userRepositary.createUser(userdata);
  return saveUser;
};

const signInUseCase = async (userdata) => {
  const { email, password } = userdata;
  const user = await userRepositary.findByEmail(email);
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!user || !passwordMatch) {
    throw new Error("Incorrect Email or password");
  }
  if(user.isBlocked){
    throw new Error("User is Blocked")
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

module.exports = {
  signUpUseCase,
  signInUseCase,
  profileDetailsUseCase,
  updateProfileUseCase,
};
