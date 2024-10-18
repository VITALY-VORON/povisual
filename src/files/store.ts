import { diskStorage } from "multer";

const normalizeFileName = (req, file, callback) => {
    const fileExtName = file.originalname.split(".").pop();

    callback(null, `${file.originalname}`);
};

export const fileCandidateStorage = diskStorage({
    destination: "./candidate",
    filename: normalizeFileName,
});

export const fileStorage = diskStorage({
    destination: "./uploads",
    filename: normalizeFileName,
});
