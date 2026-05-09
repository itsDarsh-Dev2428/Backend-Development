import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function(req, file, cb) {        // ← INSIDE diskStorage
        const sanitized = file.originalname.replace(/\s+/g, '_');
        cb(null, Date.now() + '_' + sanitized);
    }                                          // ← closes filename
});                                            // ← closes diskStorage

export const upload = multer({
    storage,
});