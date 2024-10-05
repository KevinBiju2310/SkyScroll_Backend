const userRepositary = require("../../infrastructure/repositaries/userRepositary");
// const Upload = require("../../infrastructure/utils/fileUpload");

const registerUseCase = async (airlineData) => {
  console.log(airlineData.airlineName)
  const savedAirline = await userRepositary.createUser(airlineData);
  return {
    message: "Airline Registered Successfully",
    airline: savedAirline,
  };
};

module.exports = {
  registerUseCase,
};
