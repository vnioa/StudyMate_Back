// 이메일 전송을 위한 Nodemailer 설정 파일
const nodemailer = require("nodemailer");
const {smtpHost, smtpUser, smtpPassword} = require("./dotenv"); // 환경 변수 가져오기

// SMTP 설정을 사용하여 이메일 전송기 생성
const transporter = nodemailer.createTransport({
    host: smtpHost,         // SMTP 서버 호스트
    port: 465,              // SMTP 포트 번호
    secure: false,          // 보안 연결 여부(TLS 사용)
    auth: {
        user: smtpUser,     // SMTP 사용자명(네이버 계정 아이디-> 이메일 형식으로 작성)
        pass: smtpPassword  // SMTP 비밀번호(네이버 계정 비밀번호)
    }
});

// 이메일 인증 코드를 생성하고 발송하는 함수
async function sendVerificationEmail(email, code){
    try{
        await transporter.sendMail({
            from: smtpUser,                                                         // .env에 넣어둔 네이버 계정에서 발송 처리
            to: email,                                                              // 유저가 입력한 이메일로 발송하겠다는 것
            subject: "StudyMate 이메일 인증 코드입니다.",                               // 이메일 발송 시 제목
            text: `안녕하세요.\nStudyMate 이메일 인증 코드입니다.\n\n인증 코드: ${code}`   // 이메일 발송 시 내용
        });
        console.log("이메일 인증 코드 발송 성공");
    }catch(error){
        console.error("이메일 전송 중 오류 발생: ", error);
    }
}

// 이메일 전송기와 인증 함수 모듈로 내보내기
module.exports = transporter;
module.exports.sendVerificationEmail = sendVerificationEmail;