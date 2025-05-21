const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName : { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number },
  imageUrl: { type: String },
  
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  }
});

// JWT Token generator
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "1h",
  });
  return token;
};

module.exports = mongoose.model("User", UserSchema);
