import { diskStorage } from "multer";

const normalizeFileName = (req, file, callback) => {
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
