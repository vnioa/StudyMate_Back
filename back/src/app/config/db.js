// MySQL 데이터베이스와 연결하기 위해 mysql2 라이브러리 사용
const mysql = require("mysql2");
// dotenv 설정 파일을 통해 .env 파일의 환경 변수들을 로드
require("dotenv").config();

// MySQL DB 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS
})
// 다른 파일에서 이 pool을 사용할 수 있도록 내보내기
module.exports = pool;