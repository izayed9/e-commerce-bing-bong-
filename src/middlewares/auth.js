import createHttpError from "http-errors";
import { jwtAccessKey } from "../secret.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      throw createHttpError(401, "No Acess Token found");
    }
    const decoded = await jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createHttpError(401, "Invalid Token");
    }
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
