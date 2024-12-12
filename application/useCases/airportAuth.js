const airportRepositary = require("../../infrastructure/repositaries/airportRepositary");

const addAirportUseCase = async (airportData) => {
  const { name } = airportData;
  console.log(name);
  const existingAirport = await airportRepositary.findByName(name);
  console.log(existingAirport, "ex");
  if (existingAirport) {
    throw new Error("Airport Already exists");
  }
  const newAirport = await airportRepositary.createAirport(airportData);
  return { message: "Airport added successfully", airport: newAirport };
};

const getAirportsUseCase = async () => {
  return await airportRepositary.getAllAirports();
};

const getSingleAirportUseCase = async (airportId) => {
  return await airportRepositary.findById(airportId);
};

const updateAirportUseCase = async (airportId, airportData) => {
  const existingAirport = await airportRepositary.findName(airportData.name);
  if (
    existingAirport &&
    existingAirport._id.toString() !== airportId.toString()
  ) {
    throw new Error("Airport already in use");
  }
  const updatedAirport = await airportRepositary.updateAirport(
    airportId,
    airportData
  );

  return updatedAirport;
};

const deleteAirportUseCase = async (airportId) => {
  await airportRepositary.deleteAirport(airportId);
};

module.exports = {
  addAirportUseCase,
  getAirportsUseCase,
  updateAirportUseCase,
  deleteAirportUseCase,
  getSingleAirportUseCase,
};
