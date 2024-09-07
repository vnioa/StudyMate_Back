// jwtUtils.js

const jwt = require('jsonwebtoken'); // JWT 모듈을 불러옵니다.

// JWT 토큰을 생성하는 함수입니다.
exports.generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // 1시간 유효한 토큰 발급
};

// JWT 토큰을 검증하는 함수입니다.
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET); // 토큰을 검증하고 디코딩된 내용을 반환
    } catch (error) {
        console.error('토큰 검증 오류:', error); // 토큰 검증 오류 로그
        throw error;
    }
};
