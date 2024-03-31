import multer from 'multer';

import path,{dirname} from 'path';
import { fileURLToPath } from 'url'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      
        const destinationPath = path.resolve(__dirname, '../public/images');
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
export const upload = multer({ storage: storage });