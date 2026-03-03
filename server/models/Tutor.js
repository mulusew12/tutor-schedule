import mongoose from "mongoose";
const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tutor name is required"],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
  },
  day: {
    type: String,
    required: [true, "Day is required"],
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  hourFrom: {
    type: String,
    required: [true, "Start time is required"],
  },
  hourTo: {
    type: String,
    required: [true, "End time is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;