// userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendEmail } = require('../config/mailer');
const { generateAccessToken, generateRefreshToken, generateVerificationCode } = require('../utils/userUtils');
const { validationResult } = require('express-validator');

let verificationCodes = {
    findUsername: {}, // 아이디 찾기
    resetPassword: {}, // 비밀번호 찾기 및 재설정
    signUp: {} // 회원가입
};

// -------------------- 회원가입 관련 --------------------

// 아이디 중복 확인
exports.checkUsername = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "아이디를 입력해 주세요" });
    }

    try {
        const query = `SELECT id FROM users WHERE username = ?`;
        const [results] = await db.executeQuery(query, [username]);

        // results가 undefined일 경우 빈 배열로 초기화하여 오류를 방지
        if (!results || results.length === 0) {
            res.status(200).json({ isAvailable: true, message: "사용 가능한 아이디입니다." });
        } else {
            res.status(409).json({ isAvailable: false, message: "이미 사용 중인 아이디입니다." });
        }
    } catch (error) {
        console.error('아이디 중복 확인 중 오류:', error);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
};


// 이메일 인증번호 발송 함수
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: '이메일을 입력해 주세요.' });
    }

    // 인증 코드 생성
    const verificationCode = generateVerificationCode();

    try {
        // 이메일 발송
        await sendEmail(email, 'StudyMate 인증 코드', `인증 코드는 ${verificationCode}입니다.`);
        res.status(200).json({ success: true, code: verificationCode }); // 코드 전송
    } catch (error) {
        console.error('이메일 발송 중 오류:', error);
        res.status(500).json({ error: '이메일 발송 중 오류가 발생했습니다.' });
    }
};



// 회원가입
exports.signup = async (req, res) => {
    const { username, password, name, birthDate, phone, email, isUsernameChecked, isVerified } = req.body;

    try {
        // 아이디 중복 확인 여부를 확인
        if (!isUsernameChecked) {
            return res.status(400).json({ success: false, error: '아이디 중복 확인을 먼저 해주세요.' });
        }

        // 이메일 인증 여부 확인
        if (!isVerified) {
            return res.status(400).json({ success: false, error: '이메일 인증이 완료되지 않았습니다.' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);
        const formattedPhone = phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

        // 사용자 정보 DB에 저장 (나머지 정보 업데이트)
        const query = `UPDATE users SET username = ?, password = ?, name = ?, birth_date = ?, phone = ?, email_verified = true WHERE email = ?`;
        await db.executeQuery(query, [username, hashedPassword, name, birthDate, formattedPhone, email]);

        // 회원가입 성공 메시지 전송
        res.status(201).json({ success: true, message: '회원가입이 성공적으로 완료되었습니다.' });
    } catch (error) {
        console.error('회원가입 중 오류:', error);
        res.status(500).json({ success: false, error: '회원가입 중 오류가 발생했습니다.' });
    }
};







// 이메일 인증 코드 검증
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    // 이메일과 인증 코드가 없는 경우 오류 반환
    if (!email || !code) {
        return res.status(400).json({ error: '이메일과 인증 코드를 입력해주세요.' });
    }

    try {
        // 인증 코드와 이메일을 확인
        const query = `SELECT * FROM users WHERE email = ? AND verification_token = ?`;
        const [results] = await db.executeQuery(query, [email, code]);

        // 인증 코드가 일치하지 않는 경우
        if (results.length === 0) {
            return res.status(400).json({ error: '인증 코드가 일치하지 않습니다.' });
        }

        // 이메일 인증 상태 업데이트
        const updateQuery = `UPDATE users SET email_verified = true, verification_token = NULL WHERE email = ?`;
        await db.executeQuery(updateQuery, [email]);

        // 인증 성공 응답
        res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
    } catch (error) {
        console.error('이메일 인증 처리 중 오류:', error);
        res.status(500).json({ error: '이메일 인증 처리 중 오류가 발생했습니다.' });
    }
};





// -------------------- 로그인/로그아웃 관련 --------------------

// 로그인
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: '아이디와 비밀번호를 입력해 주세요.' });
    }

    try {
        const query = `SELECT * FROM users WHERE username = ?`;
        const [results] = await db.executeQuery(query, [username]);

        if (results.length === 0) {
            return res.status(404).json({ error: '해당 아이디를 찾을 수 없습니다.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const updateQuery = `UPDATE users SET refresh_token = ? WHERE id = ?`;
        await db.executeQuery(updateQuery, [refreshToken, user.id]);

        res.status(200).json({
            message: '로그인 성공',
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('로그인 중 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

// Refresh Token으로 새로운 Access Token 발급
exports.refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateAccessToken(decoded);
        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Refresh Token 검증 중 오류:', error);
        res.status(403).json({ message: '유효하지 않은 Refresh Token입니다.' });
    }
};

// 로그아웃
exports.logout = async (req, res) => {
    const { id } = req.user;

    try {
        const query = `UPDATE users SET refresh_token = NULL WHERE id = ?`;
        await db.executeQuery(query, [id]);
        res.status(200).json({ message: "로그아웃 완료" });
    } catch (error) {
        console.error('로그아웃 중 오류:', error);
        res.status(500).json({ error: "로그아웃 처리 중 오류가 발생했습니다." });
    }
};

// -------------------- 아이디 찾기 --------------------

// 이메일로 아이디 찾기 인증번호 발송
exports.sendUsernameVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "이메일을 입력해 주세요." });
    }

    try {
        const query = `SELECT username FROM users WHERE email = ?`;
        const [results] = await db.executeQuery(query, [email]);

        if (results.length === 0) {
            return res.status(404).json({ error: "해당 이메일로 등록된 사용자가 없습니다." });
        }

        const verificationCode = generateVerificationCode();
        verificationCodes.findUsername[email] = verificationCode;

        await sendEmail(email, 'StudyMate 아이디 찾기 인증번호', `아이디 찾기 인증번호는 ${verificationCode}입니다.`);
        res.status(200).json({ message: "인증번호가 이메일로 발송되었습니다." });
    } catch (error) {
        console.error('아이디 찾기 인증번호 발송 중 오류:', error);
        res.status(500).json({ error: "이메일 발송 중 오류가 발생했습니다." });
    }
};

// 아이디 찾기 인증 코드 검증
exports.verifyUsernameCode = async (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ error: "이메일과 인증번호를 모두 입력해 주세요." });
    }

    if (verificationCodes.findUsername[email] !== verificationCode) {
        return res.status(400).json({ error: "인증번호가 일치하지 않습니다." });
    }

    try {
        const query = `SELECT username FROM users WHERE email = ?`;
        const [results] = await db.executeQuery(query, [email]);

        if (results.length === 0) {
            return res.status(404).json({ error: "해당 이메일로 등록된 아이디가 없습니다." });
        }

        const username = results[0].username;
        res.status(200).json({ message: `아이디는 ${username}입니다.` });
    } catch (error) {
        console.error('아이디 조회 중 오류:', error);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
};

// -------------------- 비밀번호 찾기 및 재설정 --------------------

// 비밀번호 재설정 인증번호 발송
exports.sendPasswordResetCode = async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "아이디와 이메일을 모두 입력해 주세요." });
    }

    try {
        const query = `SELECT id FROM users WHERE username = ? AND email = ?`;
        const [results] = await db.executeQuery(query, [username, email]);

        if (results.length === 0) {
            return res.status(404).json({ error: "해당 아이디와 이메일이 일치하는 사용자가 없습니다." });
        }

        const verificationCode = generateVerificationCode();
        verificationCodes.resetPassword[email] = verificationCode;

        await sendEmail(email, 'StudyMate 비밀번호 재설정 인증번호', `비밀번호 재설정을 위한 인증번호는 ${verificationCode}입니다.`);
        res.status(200).json({ message: "인증번호가 이메일로 발송되었습니다." });
    } catch (error) {
        console.error('비밀번호 재설정 인증번호 발송 중 오류:', error);
        res.status(500).json({ error: "이메일 발송 중 오류가 발생했습니다." });
    }
};

// 비밀번호 재설정 인증 코드 검증
exports.verifyPasswordResetCode = (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ error: "이메일과 인증번호를 모두 입력해 주세요." });
    }

    if (verificationCodes.resetPassword[email] !== verificationCode) {
        return res.status(400).json({ error: "인증번호가 일치하지 않습니다." });
    }

    res.status(200).json({ message: "인증이 완료되었습니다. 비밀번호를 재설정하세요." });
};

// 비밀번호 재설정
exports.resetPassword = async (req, res) => {
    const { username, email, newPassword, confirmPassword } = req.body;

    if (!username || !email || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: "모든 필드를 입력해 주세요." });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다." });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const query = `UPDATE users SET password = ? WHERE username = ? AND email = ?`;
        await db.executeQuery(query, [hashedPassword, username, email]);

        res.status(200).json({ message: "비밀번호가 성공적으로 재설정되었습니다." });
    } catch (error) {
        console.error('비밀번호 재설정 중 오류:', error);
        res.status(500).json({ error: "비밀번호 재설정 중 오류가 발생했습니다." });
    }
};

// -------------------- 회원탈퇴 및 모든 기록 삭제 --------------------

// 회원탈퇴 및 기록 삭제
exports.deleteUser = async (req, res) => {
    const { userId } = req.user; // JWT 토큰에서 추출한 사용자 ID

    const deleteUserActivityQueries = [
        `DELETE FROM voteslog WHERE user_id = ?`,
        `DELETE FROM voteoptions WHERE voteId IN (SELECT id FROM votes WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?))`,
        `DELETE FROM votes WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM posts WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM announcements WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM files WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM messages WHERE sender = ?`,
        `DELETE FROM chatparticipants WHERE user_id = ?`,
        `DELETE FROM chatrooms WHERE id NOT IN (SELECT DISTINCT chatRoomId FROM chatparticipants)`, // 채팅방에 남은 참가자가 없으면 삭제
    ];

    const deleteUserQuery = `DELETE FROM users WHERE id = ?`;

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        for (const query of deleteUserActivityQueries) {
            await connection.execute(query, [userId]);
        }

        await connection.execute(deleteUserQuery, [userId]);
        await connection.commit();
        connection.release();

        res.status(200).json({ message: '회원탈퇴가 완료되었습니다. 모든 활동 기록이 삭제되었습니다.' });
    } catch (error) {
        console.error('회원탈퇴 처리 중 오류:', error);
        res.status(500).json({ error: '회원탈퇴 처리 중 오류가 발생했습니다.' });
    }
};
