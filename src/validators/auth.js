import { body } from "express-validator";

export const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be at least 2-50 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string")
    .isLength({ max: 200 })
    .withMessage("Address can be up to 200 characters long"),
  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("Image file is required");
      }
      return true;
    })
    .withMessage("User image is required"),
];

export const verifyEmailValidationRules = () => {
  return [
    body("token")
      .notEmpty()
      .withMessage("Verification token is required")
      .isJWT()
      .withMessage("Invalid token format"),
  ];
};
