// MySQL 데이터베이스 연결 설정 파일
const mysql = require("mysql2/promise");

// 데이터베이스 연결 풀 설정
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",           // 데이터베이스 호스트
    user: process.env.DB_USER || "root",                // 데이터베이스 사용자명
    password: process.env.DB_PASSWORD || "password",    // 데이터베이스 비밀번호
    database: process.env.DB_NAME || "studymate",       // 사용할 데이터베이스 이름
    waitForConnections: true,                           // 연결 대기 설정
    connectionLimit: 10,                                // 최대 연결 수
    queueLimit: 0,                                      // 대기열 제한(0은 무제한)
});

// 데이터베이스 연결 풀을 모듈로 보냄
module.exports = pool;