import mongoose from "mongoose";

// Helper function to validate time format
const isValidTime = (time) => {
    // Matches formats like "9:00 AM", "12:30 PM", "09:00 AM"
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    return timeRegex.test(time);
};

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tutor name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  subject: {
    type: [String],
    required: [true, "At least one subject is required"],
    enum: {
      values: [
        "amharic",
        "english", 
        "mathematics",
        "physics",
        "chemistry",
        "general science",
        "biology",
        "history",
        "geography",
        "ict"
      ],
      message: "{VALUE} is not a valid subject"
    },
    validate: {
      validator: function(subjects) {
        return subjects && subjects.length > 0;
      },
      message: "Please select at least one subject"
    }
  },
  day: {
    type: String,
    required: [true, "Day is required"],
    enum: {
      values: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      message: "{VALUE} is not a valid day"
    },
  },
  grade: {
    type: [String],
    required: [true, "At least one grade is required"],
    enum: {
      values: [
        "grade 1", "grade 2", "grade 3", "grade 4", "grade 5", 
        "grade 6", "grade 7", "grade 8", "grade 9", "grade 10", 
        "grade 11", "grade 12"
      ],
      message: "{VALUE} is not a valid grade"
    },
    validate: {
      validator: function(grades) {
        return grades && grades.length > 0;
      },
      message: "Please select at least one grade"
    }
  },
  hourFrom: {
    type: String,
    required: [true, "Start time is required"],
    validate: {
      validator: isValidTime,
      message: props => `${props.value} is not a valid time format! Use format: 9:00 AM`
    }
  },
  hourTo: {
    type: String,
    required: [true, "End time is required"],
    validate: {
      validator: isValidTime,
      message: props => `${props.value} is not a valid time format! Use format: 5:00 PM`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for better query performance
tutorSchema.index({ day: 1, hourFrom: 1 });
tutorSchema.index({ subject: 1 });
tutorSchema.index({ grade: 1 });

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;