// routers/studyMaterialRouter.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadMaterial, getMaterials, deleteMaterial, downloadMaterial } = require('../controllers/studyMaterialController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadMaterial);
router.get('/', getMaterials);
router.delete('/:materialId', deleteMaterial);
router.get('/download/:materialId', downloadMaterial);

module.exports = router;