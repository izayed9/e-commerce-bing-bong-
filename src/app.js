import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import createHttpError from "http-errors";
import rateLimit from "express-rate-limit";
import userRouter from "./routers/userRouter.js";
import seedRouter from "./routers/seedRouter.js";
import { errorResponse } from "./controllers/responseController.js";
import authRouter from "./routers/authRouter.js";
import cookieParser from "cookie-parser";

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1minutes
  max: 5, // limit each IP
  message: "Too many requests from this IP, please try again later.",
});

app.use(rateLimiter);
app.use(morgan("short"));
app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.status(200).send({
    messsage: "Api is working fine",
  });
});

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);
app.use("/api/auth", authRouter);

// client error handling middleware
app.use((req, res, next) => {
  next(createHttpError(404, "Route not found"));
});

// Server Error Handling middleware
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message,
  });
});

export default app;
