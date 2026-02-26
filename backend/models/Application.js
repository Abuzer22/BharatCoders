import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    schemeId: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// 🚨 duplicate apply रोकने के लिए
applicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);