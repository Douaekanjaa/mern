import express from 'express';
import multer from 'multer';
import { getAllPros, registerPro, loginPro, logoutPro } from '../controllers/pro.controller.js';

const router = express.Router();

router.get('/pros', getAllPros);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/register', upload.single('photo'), registerPro);
router.post('/login', loginPro);
router.post('/logout', logoutPro);

export default router;
