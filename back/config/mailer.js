// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// 이메일 전송을 위한 Transporter 생성
const transporter = nodemailer.createTransport({
    service: 'naver', // Naver SMTP 서비스 사용
    host: 'smtp.naver.com',
    port: 465,
    secure: false, // SSL 사용
    auth: {
        user: process.env.EMAIL_USER, // 발신자 이메일 주소
        pass: process.env.EMAIL_PASS, // 발신자 이메일 비밀번호
    },
});

// 이메일 전송 함수
async function sendEmail(to, subject, text) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // 발신자 주소
            to, // 수신자 주소
            subject, // 메일 제목
            text, // 메일 내용
        });

        console.log('이메일이 성공적으로 전송되었습니다:', info.messageId);
        return info;
    } catch (error) {
        console.error('이메일 전송 실패:', error);
        throw error; // 오류 발생 시 상위 호출로 전달
    }
}

module.exports = {
    sendEmail,
};
