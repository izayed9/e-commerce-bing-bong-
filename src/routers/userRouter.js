import express from "express";
import {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  verifyUserEmail,
} from "../controllers/userController.js";
import { uploadFileMiddleware } from "../middlewares/uploadFile.js";

const userRouter = express.Router();

/**
 * @route   GET /api/users
 * @desc    Retrieve a list of all users
 * @access  Public (or specify if private/protected)
 */

userRouter.get("/", getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Retrieve a single user by their unique ID
 * @access  Public (or specify if private/protected)
 */
userRouter.get("/:id", getUserById);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a single user by their unique ID
 * @access  Public (or specify if private/protected)
 */

userRouter.delete("/:id", deleteUserById);

/**
 * @route   POST /api/users/process-register
 * @desc    Register a new user
 * @access  Public
 */

userRouter.post("/register", uploadFileMiddleware, processRegister);

/**
 * @route   POST /api/users/verify
 * @desc    Verify user email and complete registration
 * @access  Public
 */
userRouter.post("/verify", verifyUserEmail);
export default userRouter;
