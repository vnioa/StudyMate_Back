// 비밀번호 해싱 및 검증을 위한 모듈
const bcrypt = require("bcrypt");
// JWT 토큰 발급을 위한 모듈
const jwt = require("jsonwebtoken");
// 유저 정보를 가져오는 서비스 함수
const {getUserByUsername} = require("../../app/services/userService");
// Brute Force 공격 방어를 위한 미들웨어
const {rateLimiter} = require("../../app/middlewares/rateLimiter");
// 비정상 로그인 시 알림 이메일 발송 함수
const {sendLoginAlert} = require("../../app/utils/emailSender");
// 에러 로그를 기록하는 함수
const {logError} = require("../../app/utils/logger");
// 소셜 로그인 모듈
const passport = require("passport");
// JWT 토큰을 발급하기 위한 시크릿 키
const SECRET_KEY = process.env.JWT_SECRET;

// 로그인 처리
exports.login = async(req, res) => {
    // 클라이언트로부터 받은 아이디와 비밀번호를 변수에 저장
    const{username, password} = req.body;

    try{
        // 로그인 시도 횟수를 제한하는 함수를 호출해서 Brute Force 공격을 방어
        await rateLimiter.check(req.ip);

        // DB에서 유저 정보 가져오기
        const user = await getUserByUsername(username);
        // 유저가 존재하지 않으면 에러 메시지로 응답
        if(!user){
            return res.status(401).json({error: "잘못된 아이디입니다."});
        }

        // 입력된 비밀번호와 저장된 비밀번호 해시를 비교
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // 비밀번호가 일치하지 않으면 에러 메시지로 응답
        if(!isPasswordValid){
            // 실패한 시도 횟수 기록
            await rateLimiter.recordFailure(req.ip);
            return res.status(401).json({error: "잘못된 비밀번호입니다."});
        }

        // 비밀번호 검증이 성공하면 JWT 토큰 발급
        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1h"}); // 1시간 동안 유효한 토큰

        // 마지막 로그인 IP와 기기가 현재 로그인 시도와 다르면 알림 이메일 발송
        if(user.lastLoginIP !== req.ip || user.lastLoginDevice !== req.headers["user-agent"]){
            await sendLoginAlert(user.email, req.ip, req.headers["user-agent"]);
        }

        // 로그인 성공 시 사용자의 마지막 로그인 IP와 기기 정보를 업데이트
        user.lastLoginIP = req.ip;
        user.lastLoginDevice = req.headers["user-agent"];
        await user.save(); // 업데이트된 정보를 저장

        // 클라이언트에 성공 메시지와 함께 토큰을 응답
        res.json({success: true, token});
    }catch(error){
        // 에러가 발생하면 로그를 남기고 클라이언트에 에러 메시지를 응답
        logError("로그인 오류", error);
        res.status(500).json({error: "로그인 중 오류가 발생했습니다."});
    }
};

// 구글 로그인
exports.googleLogin = passport.authenticate("google", {scope: ["profile", "email"]});

exports.googleCallback = async(req, res) => {
    try{
        const{id, email, displayName} = req.user; // Passport가 인증된 사용자 정보 전달
        let user = await getUserBySocialId(id, "google"); // Google ID로 유저 찾기

        // 유저가 없다면 새로 생성
        if(!user){
            user = await createUser({socialId: id, email, name: displayName, provider: "google"});
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1h"});
        res.json({success: true, token});
    }catch(error){
        logError("구글 로그인 오류", error);
        res.status(500).json({error: "구글 로그인 중 오류가 발생했습니다."});
    }
};

// 카카오 로그인
exports.kakaoLogin = passport.authenticate("kakao");

exports.kakaoCallback = async(req, res) => {
    try{
        const {id, email, displayName} = req.user; // Passport가 인증된 사용자 정보 전달
        let user = await getUserBySocialId(id, "kakao"); // Kakao ID로 유저 찾기

        // 유저가 없다면 새로 생성
        if(!user){
            user = await createUser({socialId: id, email, name: displayName, provider: "kakao"});
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1h"});
        res.json({success: true, token});
    }catch(error){
        logError("카카오 로그인 오류", error);
        res.status(500).json({error: "카카오 로그인 중 오류가 발생했습니다.."})
    }
}

// 네이버 로그인
exports.naverLogin = passport.authenticate("naver");

exports.naverCallback = async(req, res) => {
    try{
        const {id, email, displayName} = req.user; // Passport가 인증된 사용자 정보 전달
        let user = await getUserBySocialId(id, "naver"); // Naver ID로 유저 찾기

        // 유저가 없으면 새로 생성
        if(!user){
            user = await createUser({socialId: id, email, name: displayName, provider: "naver"});
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1h"});
        res.json({ success: true, token });
    }catch(error){
        logError("Naver 로그인 오류", error);
        res.status(500).json({error: "Naver 로그인 중 오류가 발생했습니다."});
    }
};

// 인스타그램 로그인
exports.instagramLogin = passport.authenticate("instagram");

exports.instagramCallback = async (req, res) => {
    try{
        const {id, username} = req.user; // Passport가 인증된 사용자 정보 전달
        let user = await getUserBySocialId(id, "instagram"); // Instagram ID로 유저 찾기

        // 유저가 없으면 새로 생성
        if(!user){
            user = await createUser({socialId: id, name: username, provider: "instagram"});
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1h"});
        res.json({ success: true, token });
    }catch(error){
        logError("인스타그램 로그인 오류", error);
        res.status(500).json({error: "인스타그램 로그인 중 오류가 발생했습니다."});
    }
};