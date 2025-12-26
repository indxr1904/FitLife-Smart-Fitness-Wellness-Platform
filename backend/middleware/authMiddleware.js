import jwt from "jsonwebtoken";
import admin from "../firebaseAdmin.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import { error } from "console";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    let decodedData;

    try {
      const firebaseUser = await admin.auth().verifyIdToken(token);
      req.user = await User.findOne({ email: firebaseUser.email });
      if (!req.user) {
        req.user = await User.create({
          uid: firebaseUser.uid,
          name: firebaseUser.name,
          email: firebaseUser.email,
          photoURL: firebaseUser.picture,
          provider: "google",
        });
      }
      return next();
    } catch (firebaseError) {
      if (firebaseError.code === "auth/id-token-expired") {
        return res.status(401).json({
          message: "TOKEN_EXPIRED",
        });
      }
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) return res.status(404).json({ message: "User not found" });

      return next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);

      return res.status(401).json({
        message: "TOKEN_EXPIRED",
      });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Middleware to check admin privileges
export const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
