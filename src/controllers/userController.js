import createHttpError from "http-errors";
import User from "../models/userModel.js";
import { successResponse } from "./responseController.js";
import { findWithId } from "../services/findUser.js";
import { deleteImage } from "../helper/deleteImage.js";

export const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const option = { password: 0 };

    // user 10
    const users = await User.find(filter, option)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();
    if (!users) throw createHttpError(404, "No User Found");

    return successResponse(res, {
      statusCode: 200,
      message: "Users retrieved successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const option = { password: 0 };
    const user = await findWithId(User, userId, option);

    return successResponse(res, {
      statusCode: 200,
      message: "User retrieved successfully",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const option = { password: 0 };
    const user = await findWithId(User, userId, option);

    const userImagePath = user.image;
    deleteImage(userImagePath);
    // // Alternative callback method
    // fs.access(userImagePath, fs.constants.F_OK, (err) => {
    //   if (!err) {
    //     fs.unlink(userImagePath, (err) => {
    //       if (err) console.error("Error deleting user image:", err);
    //     });
    //   }
    // });

    const deleteUser = await User.findByIdAndDelete({
      _id: userId,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
      payload: {
        deleteUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
