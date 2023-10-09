const multer = require("multer");

const storage = multer.memoryStorage();
const multerConfig = {
    storage,
    limits:{
        fileSize:1024*1024
    },
    fileFilter:(req,file, cb)=>{
        // console.log("received file",file)
        if(file.mimetype === 'image/jpeg'){
            cb(null,true)

        }else{
            cb(new Error('Only JPG images are allowed'));
        }
    },
};

module.exports = multerConfig;
