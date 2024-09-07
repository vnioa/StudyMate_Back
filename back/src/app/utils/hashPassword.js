// hashPassword.js

const bcrypt = require('bcrypt'); // bcrypt 모듈을 불러옵니다.

// 비밀번호를 해싱하는 함수입니다.
exports.hashPassword = async (password) => {
    try {
        const saltRounds = 10; // 솔트 라운드 설정
        return await bcrypt.hash(password, saltRounds); // 비밀번호를 해싱하여 반환
    } catch (error) {
        console.error('비밀번호 해싱 오류:', error); // 비밀번호 해싱 오류 로그
        throw error;
    }
};

// 비밀번호를 검증하는 함수입니다.
exports.comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash); // 입력된 비밀번호와 해시를 비교
    } catch (error) {
        console.error('비밀번호 비교 오류:', error); // 비밀번호 비교 오류 로그
        throw error;
    }
};
