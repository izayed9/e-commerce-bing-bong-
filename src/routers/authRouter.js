import express from "express";
import { handleLogin, handelLogout } from "../controllers/authController.js";

const authRouter = express.Router();

// Example route for user login
authRouter.post("/login", handleLogin);

authRouter.post("/logout", handelLogout);

export default authRouter;
