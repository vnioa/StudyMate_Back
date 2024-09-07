// 이메일 인증에 필요한 모듈과 함수들을 불러옵니다.
const { getUserByEmail, saveVerificationCode } = require('../services/userService');
const { sendVerificationEmail } = require('../utils/emailSender'); // 인증 코드 전송 함수
const crypto = require('crypto'); // 랜덤 숫자 생성을 위한 모듈

// 인증 코드를 이메일로 전송하는 기능입니다.
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body; // 클라이언트로부터 받은 이메일을 저장합니다.

    try {
        // 이메일을 통해 유저 정보를 가져옵니다.
        const user = await getUserByEmail(email);
        // 유저가 없으면 에러 메시지를 응답합니다.
        if (!user) {
            return res.status(404).json({ error: '등록되지 않은 이메일입니다.' });
        }

        // 7자리 인증 코드를 생성하고 유저 정보에 저장합니다.
        const verificationCode = crypto.randomInt(1000000, 9999999).toString(); // 7자리 숫자 코드
        await saveVerificationCode(user.id, verificationCode);

        // 인증 코드를 이메일로 전송합니다.
        await sendVerificationEmail(user.email, verificationCode);
        res.json({ success: true, message: '인증 코드가 이메일로 전송되었습니다.' });
    } catch (error) {
        // 인증 코드 전송 중 에러가 발생하면 에러 메시지를 응답합니다.
        res.status(500).json({ error: '인증 코드 전송 중 오류가 발생했습니다.' });
    }
};

// 인증 코드를 검증하는 기능입니다.
exports.verifyCode = async (req, res) => {
    const { email, code } = req.body; // 클라이언트로부터 받은 이메일과 인증 코드를 저장합니다.

    try {
        // 이메일을 통해 유저 정보를 가져옵니다.
        const user = await getUserByEmail(email);
        // 인증 코드가 올바르지 않거나 만료되었으면 에러 메시지를 응답합니다.
        if (!user || user.verificationCode !== code || user.codeExpires < Date.now()) {
            return res.status(400).json({ error: '유효하지 않거나 만료된 인증 코드입니다.' });
        }

        // 인증이 완료되면 인증 상태를 갱신하고 인증 코드를 초기화합니다.
        user.isVerified = true;
        user.verificationCode = null;
        user.codeExpires = null;
        await user.save(); // 변경된 정보를 저장합니다.

        // 클라이언트에 인증 완료 메시지를 응답합니다.
        res.json({ success: true, message: '이메일 인증이 완료되었습니다.' });
    } catch (error) {
        // 인증 과정 중 에러가 발생하면 에러 메시지를 응답합니다.
        res.status(500).json({ error: '인증 과정 중 오류가 발생했습니다.' });
    }
};