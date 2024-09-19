const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Access Token 생성
exports.generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
    );
};

// Refresh Token 생성
exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

// 이메일 인증 및 비밀번호 재설정용 코드 생성
exports.generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// 이메일 발송 유틸리티
exports.sendEmail = (recipient, subject, text, callback) => {
    // 실제 메일 발송 로직 구현 필요 (nodemailer 또는 다른 메일 발송 서비스 사용)
    console.log(`Sending email to ${recipient}: ${subject} - ${text}`);
    callback(null); // 성공 시 null 전달
};
