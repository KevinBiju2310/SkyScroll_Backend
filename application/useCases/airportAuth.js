const airportRepositary = require("../../infrastructure/repositaries/airportRepositary");

const addAirportUseCase = async (airportData) => {
  const newAirport = await airportRepositary.createAirport(airportData);
  return { message: "Airport added successfully", airport: newAirport };
};

const getAirportsUseCase = async () => {
  return await airportRepositary.getAllAirports();
};

const updateAirportUseCase = async (airportId, airportData) => {
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
};
