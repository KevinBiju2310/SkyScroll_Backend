const {
  addAirportUseCase,
  getAirportsUseCase,
  updateAirportUseCase,
  deleteAirportUseCase,
} = require("../../application/useCases/airportAuth");

const addAirport = async (req, res) => {
  try {
    console.log(req.body)
    const response = await addAirportUseCase(req.body);
    res.status(201).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAirports = async (req, res) => {
  try {
    const response = await getAirportsUseCase();
    console.log(response)
    res.status(201).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAirport = async (req, res) => {
  try {
    const { airportId } = req.params;
    const airportData = req.body;
    const response = await updateAirportUseCase(airportId, airportData);
    res.status(201).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAirport = async (req, res) => {
  try {
    const { airportId } = req.params;
    console.log(airportId)
    await deleteAirportUseCase(airportId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addAirport,
  getAirports,
  updateAirport,
  deleteAirport,
};
