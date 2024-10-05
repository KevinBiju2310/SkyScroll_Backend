const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const airportController = require("../controllers/airportController");

router.post("/signin", adminController.signIn);
router.patch("/toggleblock/:id", adminController.toggleBlock);

router.post("/addairport", airportController.addAirport);
router.get("/airports", airportController.getAirports);
router.put("/:airportId", airportController.updateAirport);
router.delete("/:airportId", airportController.deleteAirport);

module.exports = router;
