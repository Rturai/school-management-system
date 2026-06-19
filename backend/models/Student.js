import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true }, // अनिवार्य किया गया
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    bloodGroup: { type: String },
    className: { type: String, required: true },
    section: { type: String, required: true },
    gender: { type: String },
    dob: { type: String },
    image: { type: String } // Base64 इमेज स्ट्रिंग यहाँ स्टोर होगी
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);