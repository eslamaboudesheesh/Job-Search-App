import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
//multer  :function >> ({storage : return od diskStorage })

//disStorage function >> ({destination  string || function, filename:function})
//const x = diskStorage ({destination  string || function, filename:function})

export const fileValidation = {
  files: ["application/pdf"]
}
export const multerUploadCloud = ({ filter }) => {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    //check file type
    if (!filter.includes(file.mimetype)) {
      return cb(new Error("invalid Format"), false);
    }

    return cb(null, true)
  };

  const multerObj = multer({ storage, fileFilter });

  return multerObj;
};
