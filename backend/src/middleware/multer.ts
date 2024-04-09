import multer from "multer";

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export const uploadSingle = multerUpload.single("avatar");

export const uploadMultiple = multerUpload.array("files", 5);