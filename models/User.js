const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  phoneNo: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  userType: {
    type: String,
    enum: ["HR", "employee", "candidate"],
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  department: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["New", "Scheduled", "Ongoing", "Selected", "Rejected"],
    default: "",
  },
  experience: {
    type: String,
    default: "",
  },
  resumeUrl: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  dateOfJoin: {
    type: Number,
  },
  attendanceStatus: {
    type: String,
    enum: ["Present", "Absent", "Medical Leave", "Work from Home"],
    default: "Present",
  },
});

module.exports = mongoose.model("User", userSchema);
