// bcrypt를 사용하여 비밀번호 해싱
const bcrypt = require("bcrypt");
// DB와 상호작용하기 위한 pool을 가져오기
const pool = require("../../config/db");
// nodemailer를 사용하여 이메일 전송
const sendEmail = require("../../config/mailConfig");

// 회원가입 처리 함수
const register = async(req, res) => {
    // 사용자 입력값 가져오기
    const {username, password, confirmPassword, name, birthdate, phone, email} = req.body;

    // 입력값 검증: 빈 값 또는 잘못된 형식의 데이터가 있는지 확인
    if(!username || !password || !confirmPassword || !name || !birthdate || !phone || !email){
        return res.status(400).json({success: false, message: "모든 정보를 정확히 입력해 주세요"});
    }

    // 비밀번호와 비밀번호 재입력이 일치하는지 확인
    if(password !== confirmPassword){
        return res.status(400).json({success: false, message: "비밀번호가 일치하지 않습니다."});
    }

    try{
        // 데이터베이스에서 이미 존재하는 아이디와 이메일인지 확인
        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email]
        );
        if(existingUser.length > 0){
            // 중복된 아이디 또는 이메일이 있을 경우
            if(existingUser[0].username === username){
                return res.status(409).json({success: false, message: "이미 존재하는 아이디입니다."});
            }
            if(existingUser[0].email === email){
                return res.status(409).json({success: false, message: "이미 존재하는 이메일입니다."});
            }
        }

        // 비밀번호를 해싱하여 DB에 안전하게 저장
        const hashedPassword = await bcrypt.hash(password, 10); // 해싱 강도를 높일 수는 있으나 보안 강도가 올라가는 만큼 성능이 저하됨

        // 7자리 인증번호를 랜덤하게 생성
        const verificationCode = Math.floor(1000000 + Math.random() * 9000000).toString();

        // 사용자 정보를 DB에 저장
        await pool.query(
            "INSERT INTO users (username, password, name, birthdate, phone, email, verification_code, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [username, hashedPassword, name, birthdate, phone, email, verificationCode, 0]
        );

        // 인증번호를 포함한 이메일을 발송
        await sendEmail(
            email,
            "StudyMate 회원가입 이메일 인증 코드입니다.",
            `안녕하세요.\nStudyMate 회원가입을 환영합니다.\n아래의 인증 코드를 정확히 입력해 주세요.\n\n인증 코드: ${verificationCode}`
        );

        // 회원가입 성공 메시지를 응답
        res.status(201).json({
            success: true,
            message: "이메일로 발송된 인증 코드를 입력하여 회원가입을 완료해 주세요.",
        });
    }catch(error){
        // DB 처리 고정에서 오류가 발생할 경우 에러 메시지 반환
        res.status(500).json({
            success: false,
            message: "회원가입 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
};

// 아이디 중복 확인 함수
const checkUsernameAvailability = async(req, res) => {
    const {username} = req.body; // 사용자의 입력값 가져오기

    try{
        // DB에 동일한 아이디가 존재하는지 확인
        const [user] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        if(user.length > 0){
            // 이미 존재하는 아이디일 경우
            return res.status(409).json({success: false, message: "이미 존재하는 아이디입니다."});
        }
        // 사용 가능한 아이디일 경우
        res.status(200).json({success: true, message: "사용 가능한 아이디입니다."});
    }catch(error){
        // DB 처리 중 오류가 발생할 경우 에러 메시지 반환
        res.status(500).json({
            success: false,
            message: "아이디 중복확인 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
};

// 이메일 인증 코드 검증 함수
const verifyEmailCode = async(req, res) => {
    const {email, verificationCode} = req.body; // 사용자 입력값 중 이메일과 인증 코드 가져오기

    try{
        // DB에서 입력된 이메일과 인증 코드가 일치하는지 확인
        const [user] = await pool.query("SELECT * FROM users WHERE email = ? AND verification_code = ?", [email, verificationCode]);
        if(user.length === 0){
            // 일치하는 사용자 정보가 없으면 인증 실패
            return res.status(400).json({success: false, message: "잘못된 인증번호입니다."});
        }

        // 인증 성공 시 인증 코드를 제거
        await pool.query("UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?", [email]);

        // 인증 성공 메시지를 응답
        res.status(200).json({success: true, message: "이메일 인증이 완료되었습니다.\n회원가입 버튼을 눌러 회원가입을 완료해 주세요."});
    }catch(error){
        // 인증 처리 중 오류가 발생할 경우 에러 메시지 반환
        res.status(500).json({
            success: false,
            message: "이메일 인증 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
};