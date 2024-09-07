// back/routes/authRoutes.js

const express = require('express');
const { registerUser } = require('../../controllers/auth/registerController');
const { loginUser } = require('../../controllers/auth/loginController');
const { findAccount } = require('../../controllers/auth/findAccountController');
const { resetPassword } = require('../../controllers/auth/passwordResetController');

const router = express.Router();

// 회원가입 라우트
router.post('/register', registerUser);

// 로그인 라우트
router.post('/login', loginUser);

// 아이디 찾기 라우트
router.post('/find-account', findAccount);

// 비밀번호 재설정 라우트
router.post('/reset-password', resetPassword);

module.exports = router;
