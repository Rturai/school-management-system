import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    className: { type: String, required: true },
    guardianName: { type: String, required: true },
    guardianPhone: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true, // 🚨 Yeh 'createdAt' date banayega jisse dashboard me month-wise graph chalega
  }
);

const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;