const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const airportController = require("../controllers/airportController");
const aircraftController = require("../controllers/aircraftController");
const { verifyTokenAdmin } = require("../middlewares/authMiddleware");

router.post("/signin", adminController.signIn);

router.get("/users", verifyTokenAdmin, adminController.getUsers);
router.patch("/toggleblock/:id", verifyTokenAdmin, adminController.toggleBlock);

router.get("/airlines", verifyTokenAdmin, adminController.getAirlines);
router.patch(
  "/togglestatusairline/:id",
  verifyTokenAdmin,
  adminController.toggleAirlineStatus
);

router.post("/addairport", verifyTokenAdmin, airportController.addAirport);
router.get("/airports", verifyTokenAdmin, airportController.getAirports);
router.get(
  "/airports/:id",
  verifyTokenAdmin,
  airportController.getSingleAirport
);
router.put("/airports/:id", verifyTokenAdmin, airportController.updateAirport);
router.delete("/:airportId", verifyTokenAdmin, airportController.deleteAirport);

router.get("/aircrafts", verifyTokenAdmin, aircraftController.getAircraftsAdmin);
router.patch("/aircrafts/:id", verifyTokenAdmin, aircraftController.updateAircraftStatus);

module.exports = router;
