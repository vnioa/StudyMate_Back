const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes'); // authRoutes 불러오기
require('dotenv').config();

// 서버 인스턴스 생성
const app = express();

// 미들웨어 설정
app.use(express.json()); // JSON 요청 파싱
app.use(cors()); // CORS 정책 허용
app.use(helmet()); // 보안 강화를 위한 HTTP 헤더 설정
app.use(morgan('dev')); // 요청 로깅 미들웨어

// 기본 경로에 대한 응답 (서버 상태 확인 용)
app.get('/', (req, res) => {
    res.send('StudyMate 서버가 실행 중입니다.');
});

// /api 경로 하위에 authRoutes 연결
app.use('/api', authRoutes);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
