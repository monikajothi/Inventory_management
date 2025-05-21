const express = require('express');
const crypto = require('crypto');
const sendOTP = require('../utils/mailer');
const router = express.Router();
const User = require('../models/users'); // adjust path as needed

let otpStore = {}; // Temporary store for OTPs (consider Redis for prod)

// Send OTP for forgot password
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email]; // remove after verification
    return res.status(200).json({ message: "OTP verified" });
  }
  res.status(400).json({ message: "Invalid OTP" });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword; // hash in production
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

module.exports = router;
