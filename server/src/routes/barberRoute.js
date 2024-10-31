import express from "express";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
import {
  addBarber,
  countBarbers,
  deleteBarber,
  deleteHoursToBarberSchedule,
  getBarber,
  getBarberAppointments,
  getBarberAvailability,
  getBarbers,
  getBarbersStats,
  setHoursToBarberSchedule,
  updateBarber,
} from "../controllers/barbersController.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, addBarber);
router.patch("/:barberId", verifyToken, verifyAdmin, updateBarber);
router.delete("/:barberId", verifyToken, verifyAdmin, deleteBarber);
router.get("/:barberId", getBarber);
router.get("/", getBarbers);
router.post(
  "/setHours/:barberId",
  verifyToken,
  verifyAdmin,
  setHoursToBarberSchedule
);
router.delete(
  "/setHours/:barberId/:availabilityId",
  verifyToken,
  verifyAdmin,
  deleteHoursToBarberSchedule
);
router.get("/schedule/:barberId", getBarberAvailability);
router.get("/count/countBarbers", verifyToken, verifyAdmin, countBarbers);
router.get("/barberStats/all", verifyToken, verifyAdmin, getBarbersStats);
router.get("/barberAppointments/:barberId", verifyToken, verifyAdmin, getBarberAppointments);

export default router;
