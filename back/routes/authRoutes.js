const express = require('express');
const authController = require('../controllers/authController'); // auth.js에서 정의한 컨트롤러 함수들

const router = express.Router();

// 아이디 중복 확인
router.post('/check-username', authController.checkUsername);

// 회원가입
router.post('/signup', authController.signup);

// 이메일 인증 코드 확인
router.post('/verify-email', authController.verifyEmail);

// 로그인
router.post('/login', authController.login);

// Refresh Token을 사용해 Access Token 재발급
router.post('/refresh-token', authController.refreshToken);

// 로그아웃
router.post('/logout', authController.logout);

// 아이디 찾기 - 이메일로 인증번호 발송
router.post('/send-username-code', authController.sendUsernameVerificationCode);

// 아이디 찾기 - 인증번호 확인 후 아이디 반환
router.post('/verify-username-code', authController.verifyUsernameCode);

// 비밀번호 재설정 - 이메일로 인증번호 발송
router.post('/send-password-reset-code', authController.sendPasswordResetCode);

// 비밀번호 재설정 - 인증번호 확인
router.post('/verify-password-reset-code', authController.verifyPasswordResetCode);

// 비밀번호 재설정
router.post('/reset-password', authController.resetPassword);

module.exports = router;
