const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  profileUrl: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);