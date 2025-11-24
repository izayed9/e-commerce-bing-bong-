import createHttpError from "http-errors";
import User from "../models/userModel.js";
import { successResponse } from "./responseController.js";
import { findWithId } from "../services/findUser.js";
import { deleteImage } from "../helper/deleteImage.js";
import { createJsonWebToken } from "../helper/jsonWebToken.js";
import { clientURL, jwtExpiresIn, jwtSecret } from "../secret.js";
import { emailWithNodeMailer } from "../helper/email.js";

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

export const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw createHttpError(409, "User already exists with this email");
    }

    //jwt token creation can be added here later

    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtSecret,
      jwtExpiresIn
    );
    console.log("Registration Token:", token);

    // Prepare email verification logic here (e.g., send email with the token)

    const emailData = {
      to: email,
      subject: "Verify your email",
      text: `Please verify your email by clicking the following link: 
      ${clientURL}/verify-email?token=${token}`,
      html: `
      <h2>Hello ${name}</h2>
      <p>Please verify your email by clicking the following link:</p>
             <a href="${clientURL}/verify-email?token=${token}">Verify Email</a>`,
    };

    try {
      await emailWithNodeMailer(emailData);
    } catch (error) {
      next(createHttpError(500, "failed to verification"));
      return;
    }
    // Note: User is not created in the database until email verification is done
    //
    const newUser = new User({
      name,
      email,
      phone,
      password,
    });

    return successResponse(res, {
      statusCode: 201,
      message: "Please go to your email and complete the process",
      payload: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
