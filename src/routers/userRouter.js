import express from "express";
import { getUsers } from "../controllers/userController.js";

const userRouter = express.Router();

/**
 * @route   GET /api/users
 * @desc    Retrieve a list of all users
 * @access  Public (or specify if private/protected)
 */

userRouter.get("/", getUsers);

export default userRouter;
