import mongoose from "mongoose";

const unitRequestSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

unitRequestSchema.index({ teacher: 1, unit: 1, status: 1 });

const UnitRequest = mongoose.model("UnitRequest", unitRequestSchema);

export default UnitRequest;
