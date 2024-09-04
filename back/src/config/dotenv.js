// dotenv 설정 파일을 로드하여 환경 변수를 사용 가능하게 설정
require("dotenv").config();

// 환경 변수 설정을 객체로 내보냄
module.exports = {
    port: process.env.PORT || 3000,             // 서버 포트 설정
    jwtSecret: process.env.JWT_SECRET,          // JWT 시크릿 키
    dbHost: process.env.DB_HOST,                // 데이터베이스 호스트
    dbUser: process.env.DB_USER,                // 데이터베이스 사용자명
    dbPassword: process.env.DB_PASSWORD,        // 데이터베이스 비밀번호
    dbName: process.env.DB_NAME,                // 데이터베이스 이름
    smtpHost: process.env.SMTP_HOST,            // 이메일 전송을 위한 SMTP 서버 호스트
    smtpUser: process.env.SMTP_USER,            // SMTP 사용자명
    smtpPassword: process.env.SMTP_PASSWORD,    // SMTP 비밀번호
};