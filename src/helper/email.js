import nodemailer from "nodemailer";
import { smtpPassword, smtpUsername } from "../secret.js";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 465, // try 465 if 587 times out
  secure: process.env.EMAIL_PORT === "465" || true, // true for 465, false for 587
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

export const emailWithNodeMailer = async (emailData) => {
  try {
    const emailInfo = {
      from: smtpUsername,
      to: emailData.email,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };
    const info = await transporter.sendMail(emailInfo);
    console.log("Message sent:", info.response);
  } catch (error) {
    console.error("Message Failed due to error", error);
    throw error;
  }
};
