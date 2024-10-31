import express from "express";
import validate from "../middleware/validator.js";
import { newUserSchema, signInSchema } from "../utils/validationSchema.js";
import {
  checkIsAdmin,
  countUsers,
  getUsers,
  login,
  logout,
  register,
  userUpdateInfo,
} from "../controllers/userControllers.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", validate(newUserSchema), register);
router.post("/login", validate(signInSchema), login);
router.post("/logout", logout);
router.patch("/:userId", verifyToken, userUpdateInfo);
router.get("/checkUser/:userId", verifyToken, checkIsAdmin);
router.get("/count/countUsers", verifyToken, verifyAdmin, countUsers);
router.get("/", verifyToken, verifyAdmin, getUsers);

export default router;
