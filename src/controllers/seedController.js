import { data } from "../data.js";
import User from "../models/userModel.js";

export const seedUser = async (req, res, next) => {
  try {
    // deleting all User
    await User.deleteMany({});
    const users = await User.insertMany(data.users);

    return res.status(201).json({
      users,
      message: "Users Create Successful",
    });
  } catch (error) {
    next(error);
  }
};
