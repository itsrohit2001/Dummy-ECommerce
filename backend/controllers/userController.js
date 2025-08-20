const User = require('../models/userModel');
const { generateHash, validateHash } = require('../utils/validateHash');
const { generateAccessToken, verifyAccessToken } = require('../utils/sessionManager');
const { sendMail } = require('../utils/sendMail');

const OTP_DATA = {};
const OTP_EXPIRY = 10 * 60 * 1000;
const OTP_RETRY_LIMIT = 5;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validateOtp(email, otp) {
  const userOtpData = OTP_DATA[email];
  if (!userOtpData) return false;
  if (userOtpData.otp !== otp) return false;
  if (Date.now() - userOtpData.createdAt > OTP_EXPIRY) return false;
  if (userOtpData.retryCount >= OTP_RETRY_LIMIT) return false;
  userOtpData.retryCount = (userOtpData.retryCount || 0) + 1;
  delete OTP_DATA[email];
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = async (req, res) => {
  const { name, email,  password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email Address is invalid" });
  }
  // if (!validateOtp(email, otp)) {
  //   return res.status(400).json({ message: "Invalid or expired OTP" });
  // }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists with this email" });
  }
  const hashedPassword = generateHash(password);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email Address is invalid" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "user does not exist, kindly register", redirect: "/register" });
  }
  if (!validateHash(password, user.password)) {
    return res.status(400).json({ message: "Password is invalid" });
  }
  const accessToken = generateAccessToken({ email: user.email, name: user.name });
  return res.status(200).json({ message: "Login successful", accessToken });
};

exports.getMe = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token is required" });
  }
  const userData = verifyAccessToken(accessToken);
  if (!userData) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
  const user = await User.findOne({ email: userData.email }).select('-password');
  return res.status(200).json({ message: "User data retrieved successfully", user });
};

exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!validateEmail(email)) return res.status(400).json({ message: "Email Address is invalid" });
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User exists, please login to place order.", redirect: "/login" });
  }
  const otp = generateOTP();
  OTP_DATA[email] = { otp, createdAt: Date.now(), retryCount: 0 };
  // Send OTP email (same as your current logic)
  const htmlContent = `<div>OTP: <b>${otp}</b></div>`;
  const response = await sendMail(email, "OTP Request", htmlContent);
  if (response && response.success) {
    return res.json({ message: "OTP sent successfully" });
  } else {
    return res.status(500).json({ message: "Failed to send OTP", error: response && response.error });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp, deleteOtp = true } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
  if (!validateEmail(email)) return res.status(400).json({ message: "Email Address is invalid" });
  if (!validateOtp(email, otp)) return res.status(400).json({ message: "Invalid or expired OTP" });
  if (deleteOtp === true || deleteOtp === "true") delete OTP_DATA[email];
  const accessToken = generateAccessToken({ email });
  return res.status(200).json({ message: "OTP verified successfully", accessToken });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const otp = generateOTP();
  OTP_DATA[email] = { otp, createdAt: Date.now(), retryCount: 0 };
  // Send OTP email
  const htmlContent = `<div>OTP for Password Reset: <b>${otp}</b></div>`;
  const response = await sendMail(email, "Password Reset Request", htmlContent);
  if (response && response.success) {
    return res.json({ message: "Password reset OTP sent successfully" });
  } else {
    return res.status(500).json({ message: "Failed to send OTP", error: response && response.error });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) return res.status(400).json({ message: "Email, OTP, and new password are required" });
  if (!validateEmail(email)) return res.status(400).json({ message: "Email address is invalid" });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  if (!validateOtp(email, otp)) return res.status(400).json({ message: "Invalid or expired OTP" });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  user.password = generateHash(password);
  await user.save();
  delete OTP_DATA[email];
  return res.json({ message: "Password reset successful" });
};