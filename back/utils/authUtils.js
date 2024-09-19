const jwt = require('jsonwebtoken');

// 7자리 랜덤 숫자로 구성되는 인증 코드 생성 함수
const generateVerificationCode = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
};

// Access Token 생성 함수
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Access Token 만료 시간 설정
    );
};

// Refresh Token 생성 함수
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_REFRESH_SECRET, // Refresh Token을 위한 별도의 비밀키 사용
        { expiresIn: '7d' } // Refresh Token 만료 시간 7일로 설정
    );
};

module.exports = {
    generateVerificationCode,
    generateAccessToken,
    generateRefreshToken,
};
