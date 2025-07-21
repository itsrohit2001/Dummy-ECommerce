const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  // user: an object with user info (e.g., { id, email })
  const secretKey = process.env.JWT_SECRET || "your_secret_key"; // Use env variable in production!
  const expiresIn = "1h"; // Token validity (e.g., 1 hour)

  // You can add any payload you want (avoid sensitive info)
  const payload = {
    email: user.email,
    name: user.name
  };

  // Generate the token - this will sign the payload with the secret key
  // and set the expiration time.
  return jwt.sign(payload, secretKey, { expiresIn });
}

function generateResetToken(user) {
  // user: an object with user info (e.g., { id, email })
  const secretKey = process.env.JWT_SECRET || "your_secret_key";
  const expiresIn = "1h"; // Token validity (e.g., 1 hour)

  // You can add any payload you want (avoid sensitive info)
  const payload = {
    email: user.email,
    name: user.name,
    resetToken: true, // Indicate this is a reset token
    purpose: "password_reset"

  };

  // Generate the token - this will sign the payload with the secret key
  // and set the expiration time.
  return jwt.sign(payload, secretKey, { expiresIn });
}
function verifyAccessToken(token) {
  const secretKey = process.env.JWT_SECRET || "your_secret_key";
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateResetToken,
  verifyAccessToken
};
// This module provides functions to generate and verify JWT access tokens.
// It uses the 'jsonwebtoken' library to create tokens with a payload containing user information.