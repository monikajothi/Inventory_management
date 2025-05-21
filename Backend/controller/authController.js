const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// JWT Configuration
const JWT_SECRET = "your_jwt_secret_here"; // In production, use process.env.JWT_SECRET
const TOKEN_EXPIRY = "1h";

// Generate token
const generateAuthToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY
  });
};

// Login Function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Direct password comparison (INSECURE)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = generateAuthToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Create new user with plain text password (INSECURE)
    const newUser = new User({
      name,
      email,
      password // Stored in plain text
    });

    await newUser.save();

    const token = generateAuthToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `OTP sent to ${email}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reset Password (Plain text storage)
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.password = newPassword; // Save as plain text
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();
    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};