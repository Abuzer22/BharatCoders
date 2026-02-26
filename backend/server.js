import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Application from "./models/Application.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ Mongo connect
mongoose
  .connect("mongodb://127.0.0.1:27017/indiathriving")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

/* ================= APPLY ROUTE ================= */

app.post("/apply", async (req, res) => {
  try {
    const {
      userId,
      schemeId,
      name,
      phone,
      email,
      fatherName,
      motherName,
      spouseName,
      gender,
      category,
      state,
      address,
      aadhaar,
    } = req.body;

    // basic validation
    if (!userId || !schemeId || !name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await Application.create({
      userId,
      schemeId,
      name,
      phone,
      email,
      fatherName,
      motherName,
      spouseName,
      gender,
      category,
      state,
      address,
      aadhaar,
    });

    return res.status(200).json({
      success: true,
      message: "Application saved",
    });
  } catch (err) {
    // duplicate apply
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Already applied",
      });
    }

    console.error("🔥 APPLY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= START ================= */

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});