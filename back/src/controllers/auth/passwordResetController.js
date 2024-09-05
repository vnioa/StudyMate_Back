// nodemailer를 사용하여 이메일 전송
const sendEmail = require("../../config/mailConfig");
// bcrypt를 사용하여 비밀번호 해싱
const bcrypt = require("bcrypt");
// DB와 상호작용하기 위한 pool 가져오기
const pool = require("../../config/db");

// 비밀번호 재설정 링크를 요청하는 함수
const requestPasswordReset = async(req, res) => {
    const {email} = req.body; // 유저 입력값 가져오기

    try{
        // 사용자가 입력한 이메일로 등록된 계정 찾기
        const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if(user.length === 0){
            return res.status(404).json({success: false, message: "이메일을 찾을 수 없습니다."});
        }

        // 비밀번호 재설정 토큰 생성
        const resetToken = Math.random().toString(36).substring(2); // 간단한 토큰 생성
        await pool.query("UPDATE users SET reset_token = ? WHERE email = ?", [resetToken, email]);

        // 재설정 링크를 포함한 이메일을 발송
        const resetLink = `http://yourapp.com/reset-password?token=${resetToken}`; // 수정 필요
        await sendMail(email, "StudyMate 비밀번호 재설정", `비밀번호를 재설정하려면 아래 링크를 클릭하세요.\n\n링크: ${resetLink}`);

        res.status(200).json({success: true, message: "비밀번호 재설정 링크가 이메일로 발송되었습니다."});
    }catch(error){
        res.status(500).json({success: false, message: "비밀번호 재설정 요청 중 오류가 발생했습니다.", error: error.message});
    }
};

// 비밀번호 재설정 함수
const resetPassword = async(req, res) => {
    const {token, newPassword} = req.body; // 요청 본문에서 토큰과 새 비밀번호를 가져옵니다.

    try {
        // 토큰이 유효한지 확인하고 사용자 정보 가져오기
        const [user] = await pool.query("SELECT * FROM users WHERE reset_token = ?", [token]);

        if (user.length === 0) {
            return res.status(400).json({ success: false, message: "잘못된 토큰입니다." });
        }

        // 새 비밀번호를 해싱하고 업데이트합니다.
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?", [hashedPassword, token]);

        res.status(200).json({ success: true, message: "비밀번호가 성공적으로 재설정되었습니다." });
    } catch (error) {
        res.status(500).json({ success: false, message: "비밀번호 재설정 중 오류가 발생했습니다.", error: error.message });
    }
};

// 모듈로 내보내어 다른 파일에서 사용할 수 있도록 설정합니다.
module.exports = { requestPasswordReset, resetPassword };