// mailConfig.js

// Nodemailer 라이브러리를 사용하여 이메일을 전송합니다.
const nodemailer = require("nodemailer");

// Nodemailer를 설정하여 SMTP 서버와의 연결을 설정합니다.
const transporter = nodemailer.createTransport({
    service: "smtp.naver.com", // 사용할 이메일 서비스 (예: Gmail)
    auth: {
        user: process.env.EMAIL_USER,    // 발신 이메일 계정
        pass: process.env.EMAIL_PASS,    // 발신 이메일 계정 비밀번호
    },
});

// 이메일 전송 기능을 간편하게 사용하기 위한 함수
const sendEmail = async (to, subject, text) => {
    try {
        // 이메일 옵션 설정
        const mailOptions = {
            from: process.env.EMAIL_USER, // 발신자 이메일
            to: to,                        // 수신자 이메일
            subject: subject,              // 이메일 제목
            text: text,                    // 이메일 본문 내용
        };

        // 이메일 전송 시도
        await transporter.sendMail(mailOptions);
        console.log("이메일 전송 성공");
    } catch (error) {
        console.error("이메일 전송 오류: ", error);
    }
};

// 이메일 전송 기능을 외부에서 사용할 수 있도록 내보냅니다.
module.exports = sendEmail;
