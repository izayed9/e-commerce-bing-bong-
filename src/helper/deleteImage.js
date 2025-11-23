import fs from "fs/promises";

export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) return;
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.log("User image deleted successfully");
  } catch (error) {
    console.error("Error deleting user image:", error.message);
  }
};
