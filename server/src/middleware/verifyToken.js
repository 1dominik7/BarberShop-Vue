import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });

    try {
      const user = await User.findById(payload.id);
      if (!user) return res.status(404).json({ message: "User not found!" });

      req.user = user;
      req.userId = payload.id;
      req.isAdmin = payload.isAdmin;

      next();
    } catch (err) {
      res.status(500).json({ message: "Internal server error!" });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required!" });
  }
  next();
};
