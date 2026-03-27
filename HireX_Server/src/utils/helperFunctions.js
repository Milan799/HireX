const nodemailer = require("nodemailer");




const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


/**
 * @param {Object} options
 * @param {string} options.to - Receiver email
 * @param {string} options.subject - Mail subject
 * @param {string} options.html - Mail body (HTML)
 */
const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // e.g. smtp.gmail.com
      port: process.env.MAIL_PORT, // 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: `"HireX Team" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Mail Error:", error);
    return { success: false, error };
  }
};

const generateJWTToken = function (data, expiresIn = "7d") {
  const jwt = require("jsonwebtoken");

  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: expiresIn });
};

module.exports = { generateOTP, sendMail, generateJWTToken };