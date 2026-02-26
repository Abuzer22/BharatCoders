import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Application from "./models/Application.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= MONGODB ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

/* ================= ROUTES ================= */

// health check
app.get("/", (req, res) => {
  res.send("IndiaThriving backend running 🚀");
});

// ✅ APPLY ROUTE
app.post("/apply", async (req, res) => {
  try {
    const { userId, schemeId } = req.body;

    if (!userId || !schemeId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await Application.create({ userId, schemeId });

    return res.status(200).json({
      success: true,
      message: "Application saved",
    });
  } catch (err) {
    // 🚨 duplicate apply
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Already applied",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});