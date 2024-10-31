import express from "express";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../controllers/servicesController.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createService);
router.get("/", getServices);
router.patch("/:serviceId", verifyToken, verifyAdmin, updateService);
router.delete("/:serviceId", verifyToken, verifyAdmin, deleteService);

export default router;
