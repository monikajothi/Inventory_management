const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    firstName: 'String',
    lastName : 'String',
    email: 'String',
    password: 'String',
    phoneNumber: 'Number',
    imageUrl: 'String',
    otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
});
// Method to generate JWT
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // 1 hour expiry for the JWT token
  });
  return token;
};

const User = mongoose.model("users", UserSchema);
module.exports = User;