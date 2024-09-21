// back/config/mailer.js

const nodemailer = require("nodemailer");

// 이메일 발송을 위한 설정(네이버 SMTP)
const transporter = nodemailer.createTransport({
    service: "naver", // 네이버 SMTP 사용
    auth: {
        user: process.env.EMAIL_USER, // 네이버 아이디
        pass: process.env.EMAIL_PASS, // 네이버 비밀번호
    },
});

// 이메일 발송 함수 정의
function sendEmail(to, subject, text, callback) {
    const mailOptions = {
        from: process.env.EMAIL_USER, // 보내는 사람 주소
        to, // 받는 사람 주소
        subject, // 이메일 제목
        text, // 이메일 내용
    };

    transporter.sendMail(mailOptions, (error, info) => {
        callback(error, info);
    });
}

// sendEmail 함수 내보내기
module.exports = { sendEmail };
