const aircraftRepositary = require("../../infrastructure/repositaries/aircraftRepositary");
const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const uploadToCloudinary = require("../../infrastructure/utils/fileUpload");
// const { updateAircraftStatus } = require("../../interfaces/controllers/aircraftController");

const addAircraftUseCase = async (aircraftData, aircraftFiles, airlineId) => {
  try {
    const { aircraftModel } = aircraftData;

    let airworthinessCertificateUrl = null;
    if (aircraftFiles?.airworthinessCertificate) {
      airworthinessCertificateUrl = await uploadToCloudinary(
        aircraftFiles.airworthinessCertificate,
        `airworthinessCertificate_${aircraftModel}`
      );
    }
    const transformedData = {
      ...aircraftData,
      yearOfManufacturer: Number(aircraftData.yearOfManufacture),
      classConfig: JSON.parse(aircraftData.classConfig),
      seatingDetails: JSON.parse(aircraftData.seatingDetails).map((detail) => ({
        ...detail,
        totalSeats: Number(detail.totalSeats),
        windowPrice: Number(detail.windowPrice),
        aislePrice: Number(detail.aislePrice),
        middlePrice: Number(detail.middlePrice),
        freeSeats: Number(detail.freeSeats),
      })),
      airworthinessCertificate: airworthinessCertificateUrl,
      airline: airlineId,
    };
    const saveAircraft = await aircraftRepositary.createAircraft(
      transformedData
    );

    return {
      message: "Aircraft Registered Successfully",
      aircraft: saveAircraft,
    };
  } catch (error) {
    console.error("Error in addAircraftUseCase:", error);
    throw new Error(`Failed to add aircraft: ${error.message}`);
  }
};

const getAircraftUseCase = async (id) => {
  const airlineId = await userRepositary.findById(id);
  if(!airlineId){
    throw new Error("Airline not found");
  }
  const allAircrafts = await aircraftRepositary.findAllAircrafts(id);
  return allAircrafts;
};

const deleteAircraftUseCase = async (id) => {
  const aircraft = await aircraftRepositary.deleteAircraft(id);
  if (!aircraft) {
    throw new Error("Aircraft not found");
  }
  return { message: "Aircraft Deleted Successfully" };
};

const adminAircraftsUseCase = async () => {
  const aircrafts = await aircraftRepositary.findAllAircraftsAdmin();
  return aircrafts;
};

const updateAircraftStatusUseCase = async (id, approvalStatus) => {
  const aircraft = await aircraftRepositary.findById(id);
  if (!aircraft) {
    throw new Error("Aircraft Not found");
  }
  aircraft.approvalStatus = approvalStatus;
  const updatedAircraft = await aircraftRepositary.save(aircraft);
  return updatedAircraft;
};

module.exports = {
  addAircraftUseCase,
  getAircraftUseCase,
  deleteAircraftUseCase,
  adminAircraftsUseCase,
  updateAircraftStatusUseCase,
};
