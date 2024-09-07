// fileHelper.js

const fs = require('fs'); // 파일 시스템 모듈
const path = require('path'); // 경로 모듈

// 파일을 읽어오는 함수입니다.
exports.readFile = (filePath) => {
    try {
        return fs.readFileSync(path.resolve(filePath), 'utf-8'); // 파일을 읽고 내용을 반환
    } catch (error) {
        console.error('파일 읽기 오류:', error); // 파일 읽기 오류 로그
        throw error;
    }
};

// 파일을 저장하는 함수입니다.
exports.writeFile = (filePath, data) => {
    try {
        fs.writeFileSync(path.resolve(filePath), data, 'utf-8'); // 파일에 데이터를 저장
    } catch (error) {
        console.error('파일 쓰기 오류:', error); // 파일 쓰기 오류 로그
        throw error;
    }
};
