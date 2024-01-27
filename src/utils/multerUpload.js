import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
//multer  :function >> ({storage : return od diskStorage })

//disStorage function >> ({destination  string || function, filename:function})
//const x = diskStorage ({destination  string || function, filename:function})

export const multerUpload = ({ folder }) => {
  const storage = diskStorage({
    // destination: `uploads/${folder}`,
    // filename: (req, file, cb) => {
    //   cb(null, nanoid() + "__" + file.originalname); //call next()
    // },
  });
  //   const fileFilter = (req, file, cb) => {
  //     //check file type
  //     if (file.mimetype == "image/png") {
  //       return cb(null, true); //save >> next()
  //     }

  //     return cb(new Error("invalid Format"), false);
  //   };

  const multerObj = multer({ storage });

  return multerObj;
};
