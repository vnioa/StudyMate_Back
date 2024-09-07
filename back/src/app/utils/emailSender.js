// 이메일 전송을 위한 nodemailer 모듈을 불러옵니다.
const nodemailer = require('nodemailer');

// 이메일 전송 설정을 구성합니다.
const transporter = nodemailer.createTransport({
    service: 'Naver', // 네이버 SMTP 서버 사용
    auth: {
        user: process.env.EMAIL_USER, // .env 파일에 저장된 이메일 주소
        pass: process.env.EMAIL_PASS, // .env 파일에 저장된 이메일 비밀번호
    },
});

// 일반적인 이메일 발송 함수입니다.
// 이메일 발송 설정을 받고, 전송합니다.
exports.sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // 발신 이메일 주소
            to: to, // 수신 이메일 주소
            subject: subject, // 이메일 제목
            text: text, // 이메일 본문 내용
        });
        console.log(`이메일이 ${to}로 성공적으로 전송되었습니다.`);
    } catch (error) {
        console.error('이메일 전송 오류:', error); // 오류가 발생하면 로그로 출력
        throw new Error('이메일 전송에 실패했습니다.'); // 상위 함수로 오류 전달
    }
};

// 비밀번호 재설정을 위한 인증 코드 발송 함수입니다.
// 사용자가 비밀번호를 재설정하기 전에 인증 코드로 검증하는 절차를 포함합니다.
exports.sendResetPasswordCode = async (to, code) => {
    const subject = '비밀번호 재설정 인증 코드'; // 이메일 제목
    const text = `안녕하세요, 비밀번호 재설정을 위해 아래 인증 코드를 입력해주세요:\n\n인증 코드: ${code}\n\n이 인증 코드는 10분 동안 유효합니다.`; // 이메일 내용
    try {
        await this.sendEmail(to, subject, text); // 이메일 발송 함수 호출
    } catch (error) {
        console.error('비밀번호 재설정 인증 코드 이메일 전송 오류:', error);
        throw new Error('비밀번호 재설정 인증 코드 이메일 전송에 실패했습니다.');
    }
};

// 이메일 인증 코드 발송 함수입니다.
// 이메일 인증을 위한 코드와 관련 메시지를 생성하여 전송합니다.
exports.sendVerificationEmail = async (to, code) => {
    const subject = '이메일 인증 코드'; // 이메일 제목
    const text = `안녕하세요, 아래 인증 코드를 입력하여 인증을 완료하세요:\n\n인증 코드: ${code}\n\n인증 코드는 10분 동안 유효합니다.`; // 이메일 내용
    try {
        await this.sendEmail(to, subject, text); // 이메일 발송 함수 호출
    } catch (error) {
        console.error('인증 코드 이메일 전송 오류:', error);
        throw new Error('인증 코드 이메일 전송에 실패했습니다.');
    }
};
