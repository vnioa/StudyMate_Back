// logger.js

// 일반적인 로그를 기록하는 함수입니다.
exports.log = (message) => {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`); // 로그 메시지와 현재 시간을 출력
};

// 에러 로그를 기록하는 함수입니다.
exports.logError = (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error); // 에러 메시지와 에러 내용을 출력
};
