import express from 'express';
import multer from 'multer';
import { registerPro, loginPro, logoutPro, updatePro, getProById } from '../controllers/pro.controller.js';

const router = express.Router();

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

router.put('/update', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]), updatePro);

router.get('/:id', getProById);


export default router;
