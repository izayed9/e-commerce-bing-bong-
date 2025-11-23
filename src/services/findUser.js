import createHttpError from "http-errors";
import mongoose from "mongoose";

export const findWithId = async (model, userId, option = {}) => {
  try {
    const item = await model.findById(userId, option);
    if (!item)
      throw createHttpError(
        404,
        `${model.modelName} does not exit with this ID`
      );
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Invalid ${model.modelName} ID`);
    }
    throw error;
  }
};
