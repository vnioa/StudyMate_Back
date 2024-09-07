// app.js

const express = require('express');
const path = require('path');
const morgan = require('morgan'); // 요청 로깅을 위한 모듈
const helmet = require('helmet'); // 기본 보안 설정을 위한 모듈
const cors = require('cors'); // CORS 설정을 위한 모듈
const multer = require('multer'); // 파일 업로드 처리 모듈
const fs = require('fs');
const sharp = require('sharp'); // 이미지 처리 모듈
const dotenv = require('dotenv'); // 환경 변수 관리 모듈
const userRouter = require('./routes/userRoutes'); // 사용자 관련 라우터 불러오기
const pool = require('./config/db'); // DB 연결 설정

dotenv.config(); // .env 파일에서 환경 변수 불러오기

const app = express();

// 미들웨어 설정
app.use(helmet()); // 보안 강화
app.use(cors()); // CORS 허용
app.use(morgan('dev')); // 요청 로깅
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱

// 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 파일 업로드 설정
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

// 라우터 설정
app.use('/user', userRouter); // 사용자 관련 라우트를 '/user' 경로로 설정

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

module.exports = app;
