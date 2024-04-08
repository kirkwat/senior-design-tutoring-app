import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(path.join(__dirname, "..", "..", "uploads", "images")))
      fs.mkdirSync(path.join(__dirname, "..", "..", "uploads", "images"), {
        recursive: true,
      });

    return cb(null, path.join(__dirname, "..", "..", "uploads", "images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

export default upload;
