const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userMiddleware = require('../middlewares/userMiddleware');

// 회원가입 관련
router.post('/signup', userController.signup);
router.post('/check-username', userController.checkUsername);
router.post('/verify-email', userController.verifyEmail);
// 이메일 인증번호 발송 관련 라우트 추가
router.post('/send-verification', userController.sendVerificationCode);

// 로그인/로그아웃 관련
router.post('/login', userController.login);
router.post('/logout', userMiddleware.verifyToken, userController.logout);
router.post('/refresh-token', userMiddleware.verifyRefreshToken, userController.refreshToken);

// 회원탈퇴
router.post('/delete-account', userMiddleware.verifyToken, userController.deleteUser);

// 아이디 찾기
router.post('/find-username/send-code', userController.sendUsernameVerificationCode);
router.post('/find-username/verify-code', userController.verifyUsernameCode);

// 비밀번호 찾기 및 재설정
router.post('/reset-password/send-code', userController.sendPasswordResetCode);
router.post('/reset-password/verify-code', userController.verifyPasswordResetCode);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
