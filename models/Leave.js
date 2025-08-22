const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  appliedDate: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

  reason: {
    type: String,
    default: "",
  },

  docsUrl: {
    type: String,
    default: "",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("Leave", leaveSchema);
