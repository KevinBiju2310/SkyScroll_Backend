const { registerUseCase } = require("../../application/useCases/airlineAuth");

const registerAirline = async (req, res) => {
  try {
    // Extract text fields and file paths from req.body
    const {
      airlineName,
      iataCode,
      airlineWebsite,
      country,
      username,
      email,
      designation,
    } = req.body;
    console.log(airlineName);

    const licenseDoc = req.body.licenseDoc;
    const insuranceDoc = req.body.insuranceDoc;

    const airlineData = {
      airlineName,
      iataCode,
      airlineWebsite,
      country,
      username,
      email,
      designation,
      licenseDoc, // PDF or Image of Airline License
      insuranceDoc, // PDF or Image of Insurance Certificate
    };
    console.log(airlineData);
    // Call the use case to handle the registration
    const response = await registerUseCase(airlineData);

    // Send success response back to client
    res.status(201).json(response);
  } catch (error) {
    // Handle any errors (e.g., file upload issues, validation errors, etc.)
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerAirline,
};
