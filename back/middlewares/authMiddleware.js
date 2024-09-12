// JWT 설정
const jwt = require('jsonwebtoken');
// .env 파일 로드
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token){
        return res.status(403).json({message: '토큰이 없습니다.'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message: '유효하지 않은 토큰입니다.'})
        }
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;