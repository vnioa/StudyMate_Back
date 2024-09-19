const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Access Token 검증 미들웨어
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        }

        req.user = user;
        next();
    });
};

// Refresh Token 검증 미들웨어
exports.verifyRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token이 없습니다.' });
    }

    db.query(`SELECT * FROM users WHERE refresh_token = ?`, [refreshToken], (err, results) => {
        if (err) {
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }

        if (results.length === 0) {
            return res.status(403).json({ message: '유효하지 않은 Refresh Token입니다.' });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Refresh Token 검증에 실패했습니다.' });
            }

            req.user = user;
            next();
        });
    });
};
