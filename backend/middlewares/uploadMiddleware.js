import multer from 'multer';


//Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

//File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
    }
}

//Initialize multer with the storage and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5MB
    },
    fileFilter: fileFilter
});


//Export the upload middleware
export default upload;