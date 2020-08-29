import path from "path";
import crypto from "crypto";
import multer from "multer";

const DIRECTORY = path.resolve(__dirname, "..", "..", "tmp");

const STORAGE = {
    storage: multer.diskStorage({
        destination: DIRECTORY,
        filename(request, { originalname }, callback) {
            const hash = crypto.randomBytes(10).toString("hex");
            const filename = `${hash}-${originalname}`;
            return callback(null, filename);
        }
    })
};

export {
    STORAGE,
    DIRECTORY
}