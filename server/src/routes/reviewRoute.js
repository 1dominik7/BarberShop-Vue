import express from "express";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
import {
  addReview,
  deleteReview,
  getBarberReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", verifyToken, addReview);
router.get("/:barberId", getBarberReviews);
router.delete("/:reviewId", verifyToken, verifyAdmin, deleteReview);

export default router;
