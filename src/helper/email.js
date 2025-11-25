import nodemailer from "nodemailer";
import { smtpUsername, smtpPassword } from "../secret.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUsername,
    pass: smtpPassword, // Gmail App Password
  },
});

export const emailWithNodeMailer = async (emailData) => {
  // ✅ Debug: log the emailData
  console.log("Sending email to:", emailData.to);

  if (!emailData || !emailData.to || emailData.to.trim() === "") {
    throw new Error("Recipient email is missing!");
  }

  const mailOptions = {
    from: `"E-commerce App" <${smtpUsername}>`, // proper from
    to: emailData.to,
    subject: emailData.subject || "No subject",
    text: emailData.text || "",
    html: emailData.html || "",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
};
