import "dotenv/config";

export const serverPort = process.env.SERVER_PORT || 4000;
export const mongoURI = process.env.MONGO_URI;
export const defaultImage =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png";
