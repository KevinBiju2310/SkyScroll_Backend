const express = require("express");
const router = express.Router();
const airlineController = require("../controllers/airlineController");
const aircraftController = require("../controllers/aircraftController");
const airportController = require("../controllers/airportController");
const tripController = require("../controllers/tripController");
const { verifyTokenAirline } = require("../middlewares/authMiddleware");

router.post("/register", airlineController.registerAirline);
router.post("/login", airlineController.login);

router.put("/profile", verifyTokenAirline, airlineController.updateProfile);
router.put("/change-password",verifyTokenAirline, airlineController.changePassword);

router.post("/add-aircraft",verifyTokenAirline, aircraftController.addAircraft);
router.get("/aircrafts", verifyTokenAirline, aircraftController.getAllAircrafts);
router.delete("/deleteaircraft/:id", verifyTokenAirline, aircraftController.deleteAircraft);

router.get("/airports", verifyTokenAirline, airportController.getAirports);

router.post("/add-trips", verifyTokenAirline, tripController.addTrips);
router.get("/trips", verifyTokenAirline, tripController.getAllTrips);
router.delete("/trips/:id", verifyTokenAirline, tripController.deleteTrips);

module.exports = router;
