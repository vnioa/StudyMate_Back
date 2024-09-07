// 필요한 모듈과 함수들을 불러옵니다.
const bcrypt = require('bcrypt'); // 비밀번호 해싱을 위한 모듈
const { validateEmail, validatePassword, validateUsername } = require('../utils/validators'); // 입력값 검증 유틸리티
const { checkUsernameExists, checkEmailExists, createUser } = require('../services/userService'); // 유저 서비스 함수들
const { sendWelcomeEmail } = require('../utils/emailSender'); // 환영 이메일 발송 함수
const { logError } = require('../utils/logger'); // 에러 로그를 기록하는 함수

// 회원가입을 처리하는 함수입니다.
exports.register = async (req, res) => {
    // 클라이언트로부터 받은 회원 정보를 변수에 저장합니다.
    const { username, password, passwordConfirm, email, name, birthdate, phone } = req.body;

    try {
        // 입력된 아이디가 형식에 맞는지 검증합니다.
        if (!validateUsername(username)) {
            return res.status(400).json({ error: '아이디는 4~20자의 영문, 숫자 조합으로 입력해야 합니다.' });
        }

        // 입력된 비밀번호가 형식에 맞는지 검증합니다.
        if (!validatePassword(password)) {
            return res.status(400).json({ error: '비밀번호는 영문, 숫자, 특수문자를 포함한 10~20자리여야 합니다.' });
        }

        // 비밀번호와 비밀번호 확인이 일치하는지 검증합니다.
        if (password !== passwordConfirm) {
            return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        // 입력된 이메일이 형식에 맞는지 검증합니다.
        if (!validateEmail(email)) {
            return res.status(400).json({ error: '유효한 이메일 형식이 아닙니다.' });
        }

        // 아이디 중복을 서버에서 최종적으로 확인합니다.
        const isUsernameTaken = await checkUsernameExists(username);
        if (isUsernameTaken) {
            return res.status(400).json({ error: '이미 사용 중인 아이디입니다.' });
        }

        // 이메일 중복을 서버에서 최종적으로 확인합니다.
        const isEmailTaken = await checkEmailExists(email);
        if (isEmailTaken) {
            return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
        }

        // 비밀번호를 해싱하여 보안을 강화합니다.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 새로운 유저를 데이터베이스에 생성합니다.
        const newUser = await createUser({
            username,
            password: hashedPassword,
            email,
            name,
            birthdate,
            phone,
        });

        // 회원가입 완료 후 환영 이메일을 발송합니다.
        await sendWelcomeEmail(email);

        // 회원가입 성공 메시지를 응답합니다.
        res.json({ success: true, message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        // 회원가입 처리 중 에러가 발생하면 에러 로그를 남기고 에러 메시지를 응답합니다.
        logError('회원가입 오류', error);
        res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
    }
};