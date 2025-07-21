const express = require("express");
const { sendMail } = require("../utils/sendMail");
const router = express.Router();
const {
  writeToFileAsJson,
  readFromFileAsJson,
} = require("../utils/fileHandler");
const { generateHash, validateHash } = require("../utils/validateHash");
const { generateAccessToken } = require("../utils/sessionManager");
const { verifyAccessToken } = require("../utils/sessionManager");
const { generateResetToken } = require("../utils/sessionManager");

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
  delete OTP_DATA[email]; // Clear OTP after validation
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/register", async (req, res) => {
  const { name, email, otp, password } = req.body;
  if (!name || !email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email Address is invalid" });
  }
  if (!validateOtp(email, otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const users = readFromFileAsJson("../data/user_data.json") || [];
  // console.log("Users data:", users);
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }

  const hashedPassword = generateHash(password);
  const user = {
    name,
    email,
    password: hashedPassword,
  };
  writeToFileAsJson([...users, user], "../data/user_data.json");
  return res.status(201).json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email Address is invalid" });
  }
  const users = readFromFileAsJson("../data/user_data.json") || [];
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({
      message: "user does not exist, kindly register",
      redirect: "/register",
    });
  }
  if (!validateHash(password, user.password)) {
    return res.status(400).json({ message: "Password is invalid" });
  }
  const accessToken = generateAccessToken({
    email: user.email,
    name: user.name,
  });
  // console.log("Access Token:", accessToken);

  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true, // Not accessible via JS (prevents XSS)
  //   secure: true, // Only sent over HTTPS (set to false for local dev)
  //   sameSite: "strict", // CSRF protection
  //   maxAge: 60 * 60 * 1000, // 1 hour
  // });

  return res.status(200).json({
    message: "Login successful",
    accessToken,
  });
});

router.get("/me", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token is required" });
  }

  const userData = verifyAccessToken(accessToken);
  if (!userData) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
  const users = readFromFileAsJson("../data/user_data.json") || [];
  const user = users.find((user) => user.email === userData.email);

  return res.status(200).json({
    message: "User data retrieved successfully",
    user: { ...user, password: undefined },
  });
});

router.post("/request-otp", async (req, res) => {
  try {
    console.log("Requesting OTP for email:", req.body.email);
    const { email } = req.body;

    // Validate email presence
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email Address is invalid" });
    }

    const users = readFromFileAsJson("../data/user_data.json") || [];
    console.log(
      "Loaded users:",
      users.map((u) => u.email)
    ); 
    const userExists = users.find(
      (user) =>
        user.email &&
        user.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (userExists) {
      console.log("User exists, blocking OTP for:", email); 
      return res.status(400).json({
        message: "User exists, please login to place order.",
        redirect: "/login",
      });
    }

    // Generate OTP and store it
    const otp = generateOTP();
    const user_otp_data = {
      otp: otp,
      createdAt: Date.now(),
      retryCount: 0,
    };
    OTP_DATA[email] = user_otp_data;

    // Prepare email content
    const htmlContent = `
      <div style="max-width:480px;margin:0 auto;background:#f7f7fa;border-radius:12px;padding:32px 24px 24px 24px;font-family:'Segoe UI',Arial,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <div style="text-align:center;">
          <div style="font-size:32px;font-weight:700;color:#2563eb;letter-spacing:1px;margin-bottom:8px;">E-Commerce</div>
          <div style="font-size:18px;color:#333;margin-bottom:24px;">Your One-Time Password (OTP)</div>
          <div style="background:#fff;border-radius:8px;padding:24px 0;margin-bottom:24px;box-shadow:0 2px 8px rgba(37,99,235,0.07);">
            <span style="font-size:40px;letter-spacing:12px;font-weight:700;color:#2563eb;">${otp}</span>
          </div>
          <div style="font-size:16px;color:#444;margin-bottom:16px;">
            Please use the above OTP to verify your email address. <br>
            This OTP is valid for <b>10 minutes</b>.
          </div>
          <div style="font-size:14px;color:#888;margin-bottom:8px;">
            If you did not request this, you can safely ignore this email.
          </div>
          <div style="margin-top:32px;font-size:13px;color:#aaa;">
            &mdash; The E-Commerce Team
          </div>
        </div>
      </div>`;

    // Send the email
    const response = await sendMail(email, "OTP Request", htmlContent);

    if (response && response.success) {
      return res.json({ message: "OTP sent successfully" });
    } else {
      // Log the error for debugging
      console.error("Failed to send OTP:", response && response.error);
      return res
        .status(500)
        .json({
          message: "Failed to send OTP",
          error: response && response.error,
        });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error("Error in /request-otp:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp, deleteOtp = true } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email Address is invalid" });
  }

  // // ADD THIS CHECK:
  // const users = readFromFileAsJson("../data/user_data.json") || [];
  // const userExists = users.find((user) => user.email === email);
  // if (userExists) {
  //   return res.status(400).json({
  //     message: "User exists, please login to place order.",
  //     redirect: "/login"
  //   });
  // }

  const user_otp_data = OTP_DATA[email];
  if (!user_otp_data) {
    return res.status(400).json({ message: "OTP not requested or expired" });
  }
  if (user_otp_data.otp !== otp) {
    user_otp_data.retryCount += 1;
    if (user_otp_data.retryCount >= 3) {
      delete OTP_DATA[email];
      return res.status(400).json({
        message: `limit exceeded, try again after ${
          OTP_RETRY_LIMIT / 6000
        } min`,
      });
    }
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  // OTP is valid, proceed with the action (e.g., email verification)
  if (deleteOtp === true || deleteOtp === "true") {
    delete OTP_DATA[email];
  }
  const accessToken = generateAccessToken({
    email: email,
  });
  return res
    .status(200)
    .json({ message: "OTP verified successfully", accessToken });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const users = readFromFileAsJson("../data/user_data.json") || [];
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const user_otp_data = {
      otp: otp,
      createdAt: Date.now(),
      retryCount: 0,
    };
    OTP_DATA[email] = user_otp_data;

    const htmlContent = `
        <div style="max-width:480px;margin:0 auto;background:#f7f7fa;border-radius:12px;padding:32px 24px 24px 24px;font-family:'Segoe UI',Arial,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          <div style="text-align:center;">
            <div style="font-size:32px;font-weight:700;color:#2563eb;letter-spacing:1px;margin-bottom:8px;">E-Commerce</div>
            <div style="font-size:18px;color:#333;margin-bottom:24px;">OTP for Password Reset</div>
            <div style="background:#fff;border-radius:8px;padding:24px 0;margin-bottom:24px;box-shadow:0 2px 8px rgba(37,99,235,0.07);">
              <span style="font-size:40px;letter-spacing:12px;font-weight:700;color:#2563eb;">${otp}</span>
            </div>
            <div style="font-size:16px;color:#444;margin-bottom:16px;">
              Use this OTP to reset your password. <br>
              This OTP is valid for <b>10 minutes</b>.
            </div>
            <div style="font-size:14px;color:#888;margin-bottom:8px;">
              If you did not request this, you can safely ignore this email.
            </div>
            <div style="margin-top:32px;font-size:13px;color:#aaa;">
              &mdash; The E-Commerce Team
            </div>
          </div>
        </div>`;

    // Add timeout wrapper
    const emailPromise = sendMail(email, "Password Reset Request", htmlContent);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email sending timeout')), 30000) // 30 second total timeout
    );

    try {
      const response = await Promise.race([emailPromise, timeoutPromise]);
      if (response.success) {
        return res.json({ message: "Password reset OTP sent successfully" });
      }
      return res.status(500).json({ 
        message: "Failed to send OTP", 
        error: response.error 
      });
    } catch (timeoutError) {
      console.error("Email sending timeout:", timeoutError.message);
      return res.status(500).json({ 
        message: "Email service temporarily unavailable. Please try again later." 
      });
    }

  } catch (error) {
    console.error("Error in /forgot-password:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      console.log("Missing fields:", { email, otp, password });
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }
    if (!validateEmail(email)) {
      console.log("Invalid email format:", email);
      return res.status(400).json({ message: "Email address is invalid" });
    }
    if (password.length < 6) {
      console.log("Password too short:", password);
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Validate OTP
    const user_otp_data = OTP_DATA[email];
    if (!user_otp_data) {
      console.log("OTP not found for email:", email, OTP_DATA);
      return res.status(400).json({ message: "OTP not requested or expired" });
    }
    if (user_otp_data.otp !== otp) {
      console.log("OTP mismatch:", { expected: user_otp_data.otp, got: otp });
      user_otp_data.retryCount += 1;
      if (user_otp_data.retryCount >= 3) {
        delete OTP_DATA[email];
        return res.status(400).json({
          message: `Limit exceeded, try again after ${
            OTP_RETRY_LIMIT / 6000
          } min`,
        });
      }
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }
    // OTP is valid, remove it

    // Update password in user_data.json
    const users = readFromFileAsJson("../data/user_data.json") || [];
    const userIndex = users.findIndex(
      (user) =>
        user.email &&
        user.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[userIndex].password = generateHash(password);
    writeToFileAsJson(users, "../data/user_data.json");
    delete OTP_DATA[email];
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in /reset-password:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
