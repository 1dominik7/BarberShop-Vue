import express from "express";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
import {
  cancelAppointment,
  countAppointments,
  createAppointment,
  getAppointmentInCurrMonthByStatus,
  getAppointments,
  latestAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", verifyToken, createAppointment);
router.patch("/cancel/:appointmentId", verifyToken, cancelAppointment);
router.get(
  "/count/countAppointments",
  verifyToken,
  verifyAdmin,
  countAppointments
);
router.get("/latestAppointments", verifyToken, verifyAdmin, latestAppointments);
router.get("/", verifyToken, verifyAdmin, getAppointments);
router.get(
  "/currentMonthByStatus",
  verifyToken,
  verifyAdmin,
  getAppointmentInCurrMonthByStatus
);

export default router;
