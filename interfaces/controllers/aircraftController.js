const {
  addAircraftUseCase,
  getAircraftUseCase,
  deleteAircraftUseCase,
  adminAircraftsUseCase,
  updateAircraftStatusUseCase,
  addSeatsUseCase
} = require("../../application/useCases/aircraftAuth");

const addAircraft = async (req, res) => {
  try {
    const airlineId = req.user.userId;
    const response = await addAircraftUseCase(req.body, req.files, airlineId);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAllAircrafts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await getAircraftUseCase(userId);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteAircraft = async (req, res) => {
  try {
    const aircraftId = req.params.id;
    const response = await deleteAircraftUseCase(aircraftId);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAircraftsAdmin = async (req, res) => {
  try {
    const response = await adminAircraftsUseCase();
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateAircraftStatus = async (req, res) => {
  try {
    const aircraftId = req.params.id;
    const { approvalStatus } = req.body;
    const response = await updateAircraftStatusUseCase(
      aircraftId,
      approvalStatus
    );
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const addSeats = async (req, res) => {
  try {
    const aircraftId = req.params.id;
    const response = await addSeatsUseCase(aircraftId, req.body);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  addAircraft,
  getAllAircrafts,
  deleteAircraft,
  getAircraftsAdmin,
  updateAircraftStatus,
  addSeats,
};
