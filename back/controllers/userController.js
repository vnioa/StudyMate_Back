const db = require('../config/db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 이메일 인증 코드 생성 함수
const generateVerificationCode = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
};

// 아이디 중복 확인
const checkUsername = async (req, res) => {
    const { username } = req.body;
    console.log(`아이디 중복 확인 요청: ${username}`); // 로그 추가

    try {
        const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        console.log(`DB 조회 결과: ${existingUser.length > 0 ? '아이디 존재' : '아이디 사용 가능'}`); // 로그 추가

        if (existingUser.length > 0) {
            return res.status(400).json({ available: false, message: '이미 사용 중인 아이디입니다.' });
        }
        res.status(200).json({ available: true });
    } catch (error) {
        console.error('아이디 중복 확인 오류:', error); // 오류 로그 추가
        res.status(500).json({ success: false, message: '아이디 중복 확인에 실패했습니다.' });
    }
};

// 이메일 인증 코드 전송
const sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    const code = generateVerificationCode();
    console.log(`이메일 인증 코드 전송 요청: ${email}, 코드: ${code}`); // 로그 추가

    // SMTP 설정
    let transporter = nodemailer.createTransport({
        host: 'smtp.naver.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.NAVER_EMAIL, // 네이버 이메일 주소
            pass: process.env.NAVER_PASSWORD, // 네이버 이메일 앱 비밀번호
        },
    });

    try {
        // 이메일 전송
        await transporter.sendMail({
            from: process.env.NAVER_EMAIL,
            to: email,
            subject: 'StudyMate 인증 코드',
            text: `인증 코드: ${code}`,
        });

        // 이메일로 전송한 인증 코드를 DB에 저장
        await db.execute('INSERT INTO verification_codes (email, code) VALUES (?, ?)', [email, code]);
        console.log('인증 코드 DB 저장 완료'); // 로그 추가
        res.status(200).json({ success: true, code });
    } catch (error) {
        console.error('이메일 전송 오류:', error); // 에러 로그 확장
        // SMTP 오류를 자세히 확인
        if (error.response) {
            console.error('SMTP 응답:', error.response); // SMTP 서버의 응답 로그
        } else {
            console.error('SMTP 연결 문제:', error.message); // 일반적인 연결 문제 로그
        }
        res.status(500).json({ success: false, message: '이메일 전송에 실패했습니다.' });
    }
};



// 회원가입 처리 함수 (bcrypt로 비밀번호 해시화)
const registerUser = async (req, res) => {
    const { username, password, name, phoneNumber, birthdate, email } = req.body;
    console.log(`회원가입 요청: ${username}, ${email}`); // 로그 추가

    try {
        // 아이디 중복 체크
        const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        console.log(`회원가입 아이디 중복 체크 결과: ${existingUser.length > 0 ? '중복' : '사용 가능'}`); // 로그 추가

        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: '이미 사용 중인 아이디입니다.' });
        }

        // 비밀번호 해시화 처리
        const hashedPassword = await bcrypt.hash(password, 10); // 해시화 강도는 10으로 설정
        console.log('비밀번호 해시화 완료'); // 로그 추가

        // 유저 정보 저장
        await db.execute(
            'INSERT INTO users (username, password, name, phoneNumber, birthdate, email) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, name, phoneNumber, birthdate, email]
        );
        console.log('회원가입 완료'); // 로그 추가

        res.status(201).json({ success: true, message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error('회원가입 오류:', error); // 오류 로그 추가
        res.status(500).json({ success: false, message: '회원가입에 실패했습니다.' });
    }
};

// 로그인 처리 함수
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(`로그인 요청: ${username}`); // 로그 추가

    try {
        // 유저 검증
        const [user] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        console.log(`로그인 유저 조회 결과: ${user.length > 0 ? '유저 존재' : '유저 없음'}`); // 로그 추가

        if (user.length === 0 || !(await bcrypt.compare(password, user[0].password))) {
            console.log('로그인 실패: 아이디 또는 비밀번호 불일치'); // 로그 추가
            return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log('JWT 토큰 생성 완료'); // 로그 추가

        // 세션 저장
        await db.execute('INSERT INTO sessions (user_id, token) VALUES (?, ?)', [user[0].id, token]);
        console.log('세션 저장 완료'); // 로그 추가

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('로그인 오류:', error); // 오류 로그 추가
        res.status(500).json({ success: false, message: '로그인에 실패했습니다.' });
    }
};

// 토큰 검증 함수
const validateToken = async (req, res) => {
    const { token } = req.body;
    console.log(`토큰 검증 요청: ${token}`); // 로그 추가

    try {
        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [session] = await db.execute('SELECT * FROM sessions WHERE user_id = ? AND token = ?', [decoded.id, token]);
        console.log(`세션 검증 결과: ${session.length > 0 ? '유효한 세션' : '유효하지 않은 세션'}`); // 로그 추가

        if (session.length === 0) {
            return res.status(401).json({ success: false, message: '세션이 유효하지 않습니다.' });
        }

        res.status(200).json({ success: true, message: '유효한 세션입니다.' });
    } catch (error) {
        console.error('토큰 검증 오류:', error); // 오류 로그 추가
        res.status(401).json({ success: false, message: '토큰 검증에 실패했습니다.' });
    }
};

// 아이디 찾기 함수
const findUserId = async (req, res) => {
    const { name, email } = req.body;
    console.log(`아이디 찾기 요청: ${name}, ${email}`); // 로그 추가

    try {
        const [user] = await db.execute('SELECT username FROM users WHERE name = ? AND email = ?', [name, email]);
        console.log(`아이디 찾기 결과: ${user.length > 0 ? user[0].username : '아이디 없음'}`); // 로그 추가

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: '해당 정보와 일치하는 아이디가 없습니다.' });
        }

        res.status(200).json({ success: true, username: user[0].username });
    } catch (error) {
        console.error('아이디 찾기 오류:', error); // 오류 로그 추가
        res.status(500).json({ success: false, message: '아이디 찾기에 실패했습니다.' });
    }
};

// 비밀번호 재설정 함수
const resetPassword = async (req, res) => {
    const { username, email, code, newPassword } = req.body;
    console.log(`비밀번호 재설정 요청: ${username}, ${email}`); // 로그 추가

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE username = ? AND email = ?', [username, email]);
        console.log(`비밀번호 재설정 유저 조회 결과: ${user.length > 0 ? '유저 존재' : '유저 없음'}`); // 로그 추가

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: '해당 정보와 일치하는 계정이 없습니다.' });
        }

        const [validCode] = await db.execute('SELECT * FROM verification_codes WHERE user_id = ? AND code = ?', [user[0].id, code]);
        console.log(`인증 코드 검증 결과: ${validCode.length > 0 ? '유효한 코드' : '잘못된 코드'}`); // 로그 추가

        if (validCode.length === 0) {
            return res.status(400).json({ success: false, message: '인증 코드가 올바르지 않습니다.' });
        }

        // 비밀번호 업데이트
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user[0].id]);
        console.log('비밀번호 재설정 완료'); // 로그 추가

        // 사용된 인증 코드 삭제
        await db.execute('DELETE FROM verification_codes WHERE user_id = ?', [user[0].id]);
        console.log('인증 코드 삭제 완료'); // 로그 추가

        res.status(200).json({ success: true, message: '비밀번호가 성공적으로 재설정되었습니다.' });
    } catch (error) {
        console.error('비밀번호 재설정 오류:', error); // 오류 로그 추가
        res.status(500).json({ success: false, message: '비밀번호 재설정에 실패했습니다.' });
    }
};

module.exports = {
    checkUsername,
    registerUser,
    sendVerificationCode,
    validateToken,
    loginUser,
    resetPassword,
    findUserId,
};
