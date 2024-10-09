const userRepositary = require("../../infrastructure/repositaries/userRepositary");
const uploadToCloudinary = require("../../infrastructure/utils/fileUpload");

const registerAirlineUseCase = async (airlineData, airlineFiles) => {
  // console.log(airlineData, airlineFiles, "from back");
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

module.exports = {
  registerAirlineUseCase,
};
