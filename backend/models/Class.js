import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, unique: true }, // e.g., "Class 10"
    section: { type: String, required: true }, // e.g., "A"
    roomNumber: { type: String },
    teacherAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" } // Teacher linked dynamically
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);