const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import the bcrypt
const bcrypt = require("bcrypt");

const UserPasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailToken: { type: String },
  emailTokenExpiresAt :Date,
  resetToken: { type: String },
  resetTokenExpiresAt:Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: "email",
  },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

// UserPasswordSchema.index({ user: 1 });
// generating a hash
UserPasswordSchema.methods.generateHash = function (salt, password) {
  return bcrypt.hashSync(salt + password);
};

// checking if password is valid
UserPasswordSchema.methods.validPassword = function (salt, userPassword) {
  return bcrypt.compareSync(salt + userPassword, this.password);
};

module.exports = mongoose.model("UserPassword", UserPasswordSchema);
