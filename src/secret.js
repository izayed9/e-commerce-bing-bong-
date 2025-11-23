import "dotenv/config";

export const serverPort = process.env.SERVER_PORT || 4000;
export const mongoURI = process.env.MONGO_URI;
export const defaultImage =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png";
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresIn = process.env.expiresIn || "10m";
export const smtpUsername = process.env.SMTP_USERNAME;
export const smtpPassword = process.env.SMTP_PASSWORD;
export const clientURL = process.env.CLIENT_URL || "http://localhost:3000";
