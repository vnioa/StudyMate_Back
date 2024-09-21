// MySQL 데이터베이스와 연결하기 위해 mysql2 라이브러리 사용
const mysql = require("mysql2");
// dotenv 설정 파일을 통해 .env 파일의 환경 변수들을 로드
require("dotenv").config();

// MySQL DB 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// DB 연결
db.connect((err) => {
    if(err){
        console.error("DB 연결 실패: ", err.message);
    }else{
        console.log("DB 연결 성공");
    }
})

// 다른 파일에서 이 pool을 사용할 수 있도록 내보내기
module.exports = db;