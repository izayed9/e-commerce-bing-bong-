import jwt from "jsonwebtoken";

export const createJsonWebToken = (payload, secret, expiresIn) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("Payload is required to create a JWT");
  }
  if (!secret) {
    throw new Error("Secret key is required to create a JWT");
  }
  if (!expiresIn) {
    throw new Error("Expiration time is required to create a JWT");
  }
  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("Failed to create JWT");
  }
};
