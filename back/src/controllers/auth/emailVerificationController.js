// nodemailer를 사용하여 이메일을 전송
const sendEmail = require('../../config/mailConfig');
// 데이터베이스와 상호작용하기 위한 pool을 가져오기
const pool = require('../../config/db');

// 이메일 인증번호 요청 함수
// 이메일 인증 후 회원가입 버튼을 누르면 DB에 내용이 모두 저장되고 회원가입 완료
const requestEmailVerification = async (req, res) => {
    const { email } = req.body; // 사용자 입력값 가져오기

    try {
        // 사용자가 입력한 이메일로 등록된 계정을 탐색
        const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "이메일을 찾을 수 없습니다." });
        }

        // 7자리 숫자(인증 코드) 발급
        const verificationCode = Math.floor(1000000 + Math.random() * 9000000).toString();

        // 생성된 인증번호를 DB에 저장
        await pool.query("UPDATE users SET verification_code = ? WHERE email = ?", [verificationCode, email]);

        // 인증번호를 포함한 이메일을 발송
        await sendEmail(
            email,
            "StudyMate 이메일 인증 코드입니다.",
            `안녕하세요.\n아래 코드를 정확히 입력해 주세요.\n\n인증 코드: ${verificationCode}`
        );

        res.status(200).json({
            success: true,
            message: "인증 코드가 이메일로 발송되었습니다.\n회원가입 페이지에서 인증 코드를 입력하여 회원가입을 완료하세요.",
        });
    } catch (error) {
        // 인증번호 요청 중 오류가 발생할 경우 에러 메시지 반환
        res.status(500).json({
            success: false,
            message: "인증번호 요청 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
};

// 이메일 인증번호 검증 함수
const verifyEmailCode = async (req, res) => {
    const { email, verificationCode } = req.body; // 사용자 입력값 가져오기

    try {
        // 데이터베이스에서 입력된 이메일과 인증번호가 일치하는지 확인
        const [user] = await pool.query("SELECT * FROM users WHERE email = ? AND verification_code = ?", [email, verificationCode]);
        if (user.length === 0) {
            // 일치하는 사용자 정보가 없으면 인증 실패
            return res.status(400).json({ success: false, message: "잘못된 인증번호입니다." });
        }

        // 인증 성공 시 계정 활성화
        await pool.query("UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?", [email]);

        // 인증 성공 메시지를 응답합니다.
        res.status(200).json({ success: true, message: "이메일 인증이 완료되었습니다. 계정이 활성화되었습니다." });
    } catch (error) {
        // 인증 처리 중 오류가 발생할 경우 에러 메시지 반환
        res.status(500).json({
            success: false,
            message: "이메일 인증 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
};

// 모듈로 내보내기
module.exports = { requestEmailVerification, verifyEmailCode };
