const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const airportController = require("../controllers/airportController");
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
router.put("/:airportId", airportController.updateAirport);
router.delete("/:airportId", verifyTokenAdmin, airportController.deleteAirport);

module.exports = router;
