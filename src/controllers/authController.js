import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { successResponse } from "./responseController.js";
import { createJsonWebToken } from "../helper/jsonWebToken.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { jwtAccessKey } from "../secret.js";
import { use } from "react";

export const handleLogin = async (req, res, next) => {
  try {
    // email and password from req.body
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Authentication failed");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createHttpError(401, "email/password did not matched");
    }

    // isBanned check
    if (user.isBanned) {
      throw createHttpError(
        403,
        "Your account has been banned please contact support"
      );
    }

    // generate JWT token
    const accessToken = createJsonWebToken(
      { id: user._id },
      jwtAccessKey,
      "15m"
    );
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: "none",
    });

    successResponse(res, {
      statusCode: 200,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

export const handelLogout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    successResponse(res, {
      statusCode: 200,
      message: "User Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
