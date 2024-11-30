// import the mongoose lib
const mongoose = require("mongoose");

const UserLeaveSchema = new mongoose.Schema(
  {
    approval: {
      type: String,
      default: "pending",
      enum: ["pending", "cancelled", "approved", "denied"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    total: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    isDraggable: {
      type: Boolean,
      required: true,
      default: false,
      enum: [true, false],
    },
  },
  {
    timestamps: true,
  }
);

const UserLeaveModel = mongoose.model("UserLeave", UserLeaveSchema);

module.exports = UserLeaveModel;
