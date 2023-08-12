import multer from "multer";

// set storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // get file extension
    const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
    cb(
      null,
      file.originalname.substring(0, file.originalname.lastIndexOf(".")) +
        "-" +
        file.fieldname +
        "-" +
        Date.now() +
        ext
    );
    // cb(null, file.originalname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

export default upload;
