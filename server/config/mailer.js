const nodemailer = require("nodemailer");

// 이메일 발송을 위한 설정(네이버 SMTP)
const transporter = nodemailer.createTransport({
    service: "naver", // 네이버 SMTP 사용
    auth: {
        user: process.env.EMAIL_USER, // 네이버 아이디
        pass: process.env.EMAIL_PASSWORD, // 네이버 비밀번호
    },
});

module.exports = transporter;