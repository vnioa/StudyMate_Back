// MySQL 데이터베이스와 연결하기 위해 mysql2 라이브러리 사용
const mysql = require("mysql2/promise");
// dotenv 설정 파일을 통해 .env 파일의 환경 변수들을 로드
const dotenv = require("./dotenv");

// 환경 변수 설정(dotenv.js에서 설정된 값 가져오기)
dotenv();

// 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST,          // 데이터베이스 호스트 주소
    user: process.env.DB_USER,          // 데이터베이스 사용자 이름
    password: process.env.DB_PASS,      // 데이터베이스 비밀번호
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,// 사용할 데이터베이스 이름
    waitForConnections: true,           // 연결이 부족할 때 대기할 지 여부
    connectionLimit: 10,                // 동시에 열 수 있는 최대 연결 수
    queueLimit: 0,                      // 대기열 제한(0은 무제한)
});

// 다른 파일에서 이 pool을 사용할 수 있도록 내보내기
module.exports = pool;