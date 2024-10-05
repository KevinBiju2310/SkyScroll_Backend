const express = require("express");
const router = express.Router();
const airlineController = require("../controllers/airlineController");

router.post("/register", airlineController.registerAirline);

module.exports = router;
