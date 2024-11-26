const bcrypt = require("bcryptjs");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const tripRepositary = require("../../infrastructure/repositaries/tripRepositary");
const bookingRepositary = require("../../infrastructure/repositaries/bookingRepositary");
const aircraftRepositary = require("../../infrastructure/repositaries/aircraftRepositary");
const uploadToCloudinary = require("../../infrastructure/utils/fileUpload");

const registerAirlineUseCase = async (airlineData, airlineFiles) => {
  const { airlineName } = airlineData;
  let airlineLicenseUrl = null;
  let insuranceCertificateUrl = null;

  if (airlineFiles?.licenseDocument) {
    airlineLicenseUrl = await uploadToCloudinary(
      airlineFiles.licenseDocument,
      `airlineLicense_${airlineName}`
    );
  }

  if (airlineFiles?.insuranceDocument) {
    insuranceCertificateUrl = await uploadToCloudinary(
      airlineFiles.insuranceDocument,
      `insuranceCertificate_${airlineName}`
    );
  }

  const airlineRegistrationDetails = {
    ...airlineData,
    licenseDocument: airlineLicenseUrl,
    insuranceDocument: insuranceCertificateUrl,
    role: "airline",
  };

  const saveAirline = await userRepositary.createUser(
    airlineRegistrationDetails
  );
  console.log(saveAirline);
  return {
    message: "Airline Registered Successfully",
    airline: saveAirline,
  };
};

const loginUseCase = async (loginData) => {
  const { email, password } = loginData;
  console.log(email, password, "user case");
  const airline = await userRepositary.findByEmail(email);
  if (!airline) {
    throw new Error("Invalid Email or Password");
  }
  if (!airline.password) {
    throw new Error("You are not verified");
  }
  const passwordMatch = await bcrypt.compare(password, airline.password);
  if (!passwordMatch) {
    throw new Error("Invalid Email or Password");
  }
  if (airline.role !== "airline") {
    throw new Error("You are not allowed");
  }
  return airline;
};

const updateProfileUseCase = async (airlineId, profileDetails) => {
  const updateAirlineProfile = await userRepositary.updateUserProfile(
    airlineId,
    profileDetails
  );
  console.log(updateAirlineProfile, "backend");
  return updateAirlineProfile;
};

const uploadLogoUseCase = async (logo, id) => {
  const airline = await userRepositary.findById(id);
  let airlineLogoUrl = null;
  if (logo) {
    airlineLogoUrl = await uploadToCloudinary(
      logo,
      `logo_${airline.airlineName}`
    );
  }
  console.log(airlineLogoUrl);
  const saveLogo = await userRepositary.uploadLogo(id, {
    profilepic: airlineLogoUrl,
  });
  return saveLogo;
};

const changePasswordUseCase = async (airlineId, passwords) => {
  const { currentPassword, newPassword } = passwords;
  const airline = await userRepositary.findById(airlineId);
  if (!airline) {
    throw new Error("Airline not found");
  }
  const passwordMatch = await bcrypt.compare(currentPassword, airline.password);
  if (!passwordMatch) {
    throw new Error("Current Password is incorrect");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  airline.password = hashedPassword;
  await userRepositary.save(airline);
  return { message: "Password successfully changed" };
};

const getAllBookingsUseCase = async (id) => {
  const trips = await tripRepositary.findAllTrips(id);
  const tripIds = trips.map((trip) => trip._id);
  const bookings = await bookingRepositary.findBookingsByTripId(tripIds);
  return bookings;
};

const bookingStatusUseCase = async (id, status) => {
  const updatedBooking = await bookingRepositary.changeStatus(id, status);
  return updatedBooking;
};

const bookedUsersUseCase = async (id) => {
  const trips = await tripRepositary.findTripsByAirlineId(id);
  const tripIds = trips.map((trip) => trip._id);
  const bookings = await bookingRepositary.findUserIdByTripId(tripIds);
  const user = bookings.map((booking) => booking.userId);
  return user;
};

const statisticsUseCase = async (id) => {
  const totalAircraft = await aircraftRepositary.countAircraftByAirline(id);  
  const totalBookings = await bookingRepositary.countBookingsByAirline(id);
  const totalTrips = await tripRepositary.countTripsByAirline(id);
  return { totalAircraft, totalBookings, totalTrips };
};

module.exports = {
  registerAirlineUseCase,
  loginUseCase,
  updateProfileUseCase,
  changePasswordUseCase,
  getAllBookingsUseCase,
  uploadLogoUseCase,
  bookingStatusUseCase,
  bookedUsersUseCase,
  statisticsUseCase,
};
