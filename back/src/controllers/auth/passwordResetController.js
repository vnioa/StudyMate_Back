// 비밀번호 재설정에 필요한 모듈과 서비스 함수 불러오기
const {getUserByEmail, updateUserPassword} = require("../../app/services/userService");
// 비밀번호 해싱을 위한 모듈
const bcrypt = require("bcrypt");
// 비밀번호 복잡성 검사를 위한 유틸 함수
const {validatePassword} = require("../../app/utils/validators");
// 비밀번호 재설정 이메일 발송 함수
const {sendResetPasswordEmail} = require("../../app/utils/emailSender");
// 토큰 생성을 위한 모듈
const crypto = require("crypto");

// 비밀번호 재설정을 요청하는 기능
exports.requestPasswordReset = async(req, res) => {
    const {email} = req.body; // 클라이언트로부터 받은 이메일 저장

    try{
        // 이메일을 통해 유저 정보 가져오기
        const user = await getUserByEmail(email);
        // 유저가 없다면 에러 메시지 응답
        if(!user){
            return res.status(404).json({error: "등록되지 않은 이메일입니다."});
        }

        // 7자리 인증 코드를 생성하고 유저 정보에 저장
        const verificationCode = crypto.randomInt(1000000, 9999999).toString(); // 7자리 숫자 코드
        user.verificationCode = verificationCode;
        user.codeExpires = Date.now() + 600000; // 인증 코드 10분 후 만료
        await user.save(); // 변경된 유저 정보 저장

        // 인증 코드를 포함한 이메일 발송
        await sendResetPasswordEmail(user.email, verificationCode);
        res.json({success: true, message: "비밀번호 재설정 인증 코드가 이메일로 발송되었습니다."});
    }catch(error){
        // 인증 코드 전송 중 에러가 발생하면 에러 메시지 응답
        res.status(500).json({error: "인증 코드 전송 중 오류가 발생했습니다."});
    }
};

// 인증 코드를 검증하고 비밀번호 재설정 페이지로 이동하도록 처리합니다.
exports.verifyResetCode = async (req, res) => {
    const { email, code } = req.body; // 클라이언트로부터 받은 이메일과 인증 코드를 저장합니다.

    try {
        // 이메일을 통해 유저 정보를 가져옵니다.
        const user = await getUserByEmail(email);
        // 인증 코드가 올바르지 않거나 만료되었으면 에러 메시지를 응답합니다.
        if (!user || user.verificationCode !== code || user.codeExpires < Date.now()) {
            return res.status(400).json({ error: '유효하지 않거나 만료된 인증 코드입니다.' });
        }

        // 인증 코드가 유효하다면 프론트엔드에 성공 메시지를 보내고 비밀번호 재설정 페이지로 이동합니다.
        res.json({ success: true, message: '인증이 완료되었습니다. 비밀번호 재설정 페이지로 이동하세요.' });
    } catch (error) {
        // 인증 과정 중 에러가 발생하면 에러 메시지를 응답합니다.
        res.status(500).json({ error: '인증 과정 중 오류가 발생했습니다.' });
    }
};

// 비밀번호를 실제로 재설정하는 기능입니다.
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body; // 클라이언트로부터 받은 이메일과 새 비밀번호를 저장합니다.

    try {
        // 이메일을 통해 유저 정보를 가져옵니다.
        const user = await getUserByEmail(email);
        // 유저가 없으면 에러 메시지를 응답합니다.
        if (!user) {
            return res.status(404).json({ error: '등록되지 않은 이메일입니다.' });
        }

        // 새 비밀번호가 복잡성 조건을 만족하는지 검증합니다.
        if (!validatePassword(newPassword)) {
            return res.status(400).json({ error: '비밀번호가 조건에 맞지 않습니다.' });
        }

        // 비밀번호를 해싱하여 저장하고, 인증 코드를 초기화합니다.
        user.password = await bcrypt.hash(newPassword, 10);
        user.verificationCode = null;
        user.codeExpires = null;
        await user.save(); // 변경된 정보를 저장합니다.

        // 클라이언트에 성공 메시지를 응답합니다.
        res.json({ success: true, message: '비밀번호가 성공적으로 재설정되었습니다.' });
    } catch (error) {
        // 비밀번호 재설정 중 에러가 발생하면 에러 메시지를 응답합니다.
        res.status(500).json({ error: '비밀번호 재설정 중 오류가 발생했습니다.' });
    }
};