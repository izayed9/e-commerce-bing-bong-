import multer, { memoryStorage } from "multer";
import { uploadPath } from "../secret.js";

// ✅ Multer storage
const storage = multer.memoryStorage();

// ✅ File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; // allowed extensions
  const mimetype = allowedTypes.test(file.mimetype); // check MIME type
  const extname = allowedTypes.test(file.originalname.toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)"), false);
  }
};

// ✅ Set file size limit (e.g., 2MB)
const limits = {
  fileSize: 2 * 1024 * 1024, // 2 MB
};

// ✅ Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

export const uploadFileMiddleware = upload.single("image");
