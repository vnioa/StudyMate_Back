const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// 아이디 중복 확인 라우트
router.post('/check-username', authController.checkUsername);

// 회원가입 라우트
router.post('/signup', authController.signup);

// 이메일 인증 라우트
router.post('/verify-email', authController.verifyEmail);

//

module.exports = router;