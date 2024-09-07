// routes/userRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// 파일 업로드 설정 (기존의 업로드 설정을 재사용)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only .png files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// 회원가입 라우트 (POST /join)
router.post('/join', upload.single('profile_image'), async (req, res) => {
    const { username, email, password, name, phone_number, birth_date, role } = req.body;
    let profile_image = req.file ? req.file.path : null;

    if (profile_image) {
        const outputPath = profile_image.replace(path.extname(profile_image), '-processed.png');

        try {
            await fs.promises.access(profile_image, fs.constants.F_OK | fs.constants.R_OK);
            await sharp(profile_image).resize(800).toFile(outputPath);
            fs.unlinkSync(profile_image); // 원본 파일 삭제
            profile_image = outputPath;
        } catch (err) {
            console.error('Error processing image:', err);
            return res.status(500).json({ message: 'Error processing image' });
        }
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, email, password_hash, name, phone_number, birth_date, profile_image, role)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [username, email, password_hash, name, phone_number, birth_date, profile_image, role]);
        res.status(200).json({ message: 'User successfully created!' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Database error occurred' });
    }
});

// 로그인 라우트 (POST /login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        res.json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Database error', error: err });
    }
});

module.exports = router;