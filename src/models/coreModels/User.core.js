const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: { type: String, required: true },
  surname: { type: String },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "employee",
    enum: ["owner", "admin", "manager", "employee", "create_only", "read_only"],
  },
  bio: {
    type: String,
  },
  timezone: {
    type: String,
    enum: ["EAT 3+"],
    default: "EAT 3+",
  },
  year_leave: {
    type: Number,
    default: 60,
  },
});

module.exports = mongoose.model("Core_user",userSchema);
