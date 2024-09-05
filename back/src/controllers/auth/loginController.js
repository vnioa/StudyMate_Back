// passport를 사용하여 사용자 인증을 처리
const passport = require("passport");

// 로그인 처리 함수
const login = (req, res, next) => {
    // passport의 로컬 인증 전략을 사용하여 로그인 시도
    passport.authenticate("local", (err, user, info) => {
        if(err){
            // 인증 과정에서 오류가 발생하면 오류 메시지와 함께 다음 미들웨어로 전달
            return res.status(500).json({success: false, message: "서버 오류가 발생했습니다.", error: err.message})
        }
        if(!user){
            // 인증 실패 시 사용자에게 알림 메시지 전달
            return res.status(401).json({success: false, message: info.message || "잘못된 사용자 이름 또는 비밀번호입니다."});
        }

        // 인증에 성공한 경우 세션에 사용자 정보를 저장
        req.logIn(user, (err) => {
            if(err){
                return res.status(500).json({success: false, message: "로그인 중 오류가 발생했습니다.", error: err.message});
            }

            // 로그인 성공 시 응답 메시지와 함께 사용자 정보를 반환
            req.status(200).json({
                success: true,
                message: "로그인 성공",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        });
    })(req, res, next); // Passport 인증 미들웨어 실행
};

// 모듈로 내보내 다른 파일에서 사용할 수 있도록 설정
module.exports = {login};