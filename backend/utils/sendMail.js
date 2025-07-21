const nodemailer = require("nodemailer");

const sendMail = async (to, subject, htmlContent, attempt = 1) => {
  const maxRetries = 3;
  const timeout = 15000; // 15 seconds timeout

  console.log(`Attempt ${attempt}: Sending email to ${to}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // your Gmail address
      pass: process.env.GMAIL_PASS, // your Gmail App Password
    },
    // Add timeouts to prevent hanging
    connectionTimeout: timeout,
    greetingTimeout: timeout,
    socketTimeout: timeout,
  });

  const mailOptions = {
    from: `"E-commerce" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully on attempt ${attempt}:`, info.messageId);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error(`Attempt ${attempt} failed:`, error.message);
    
    // Retry for network errors only
    if (
      (error.code === "ESOCKET" || error.code === "ETIMEDOUT" || error.code === "ECONNRESET") &&
      attempt < maxRetries
    ) {
      console.log(`Retrying in 2 seconds... (${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await sendMail(to, subject, htmlContent, attempt + 1);
    }
    
    return { 
      success: false, 
      message: `Failed to send email after ${attempt} attempts`, 
      error: error.message 
    };
  }
};

module.exports = { sendMail };
