import { validationResult } from "express-validator";
import { errorResponse } from "../controllers/responseController.js";

export const runValidationRules = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
