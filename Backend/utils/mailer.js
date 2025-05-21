const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "murugansupermarkets25@gmail.com", // your Gmail
    pass: "xbxwcizalbjgzfkz", // use app password if 2FA
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: '"Inventory System" <murugansupermarkets25@gmail.com>',
    to: email,
    subject: "OTP Verification",
    html: `<p>Your OTP is: <b>${otp}</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
