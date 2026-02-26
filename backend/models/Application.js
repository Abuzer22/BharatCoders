import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: String,
    schemeId: Number,

    // Basic
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,

    // Family (only one will be filled)
    fatherName: String,
    motherName: String,
    spouseName: String,

    // Personal
    gender: String,
    category: String,

    // Location
    state: String,
    address: String,

    // Optional
    aadhaar: String,
  },
  { timestamps: true }
);

// 🔥 prevent duplicate apply
applicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);