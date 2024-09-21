// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http'); // HTTP 서버 생성용 모듈
require('dotenv').config();

// 라우트 파일 불러오기
const userRoutes = require('./routes/userRoutes'); // 사용자 관련 라우트
const chatRoutes = require('./routes/chatRoutes'); // 채팅 관련 라우트
const roomRoutes = require('./routes/roomRoutes'); // 채팅방 관련 라우트

// Socket.IO 초기화 함수 불러오기
const { initializeSocket } = require('./utils/socketUtils');

// 서버 인스턴스 생성
const app = express();
const server = http.createServer(app); // HTTP 서버 생성

// 미들웨어 설정
app.use(express.json()); // JSON 요청 파싱
app.use(cors()); // CORS 정책 허용
app.use(helmet()); // 보안 강화를 위한 HTTP 헤더 설정
app.use(morgan('dev')); // 요청 로깅 미들웨어

// 기본 경로에 대한 응답 (서버 상태 확인 용)
app.get('/', (req, res) => {
    res.send('StudyMate 서버가 실행 중입니다.');
});

// 라우트 연결
app.use('/routes/users', userRoutes); // 사용자 관련 경로
app.use('/routes/chats', chatRoutes); // 채팅 관련 경로
app.use('/routes/rooms', roomRoutes); // 채팅방 관련 경로

// Socket.IO 초기화
initializeSocket(server);

// 서버 실행
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
