// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

// 데이터베이스 연결을 위한 커넥션 풀 생성
async function initializeDB() {
    try {
        pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        console.log('MySQL 데이터베이스에 연결되었습니다.');
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        process.exit(1); // 연결 실패 시 프로세스를 종료합니다.
    }
}

// 쿼리 실행 함수
async function executeQuery(query, params = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (error) {
        console.error('쿼리 실행 중 오류 발생:', error);
        throw error; // 오류가 발생하면 호출한 곳으로 오류를 전달합니다.
    }
}

// 초기화 함수 실행
initializeDB();

// 모듈로 내보내기
module.exports = {
    executeQuery,
};
