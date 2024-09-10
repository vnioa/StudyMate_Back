// 이메일 인증을 위한 nodemailer 가져오기
const nodemailer = require('nodemailer');
// .env 파일 로드
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'naver', // 네이버 이메일 서비스 이용
    auth: {
        user: process.env.NAVER_USER, // 네이버 이메일
        pass: process.env.NAVER_PASS // 네이버 비밀번호
    }
});

module.exports = transporter;