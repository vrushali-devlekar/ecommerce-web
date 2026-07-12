const multer = require("multer");

// Use MemoryStorage for handling uploads efficiently (buffer is passed to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Only accept standard web image formats
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and WEBP images are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;
