// 로그아웃 처리 함수
exports.logout = (req, res) => {
    try{
        // 현재 세션을 파괴하여 로그아웃 처리
        req.session.destroy((error) => {
            if(err){
                // 세션 파괴 중 오류가 발생하면 에러 메시지 응답
                return res.status(500).json({error: "로그아웃 중 오류가 발생했습니다."});
            }
            // 세션 쿠키를 제거하여 완전한 로그아웃이 되돌고 합니다.
            res.clearCookie("sessionID");
            res.json({success: true, message: "로그아웃이 완료되었습니다."});
        });
    }catch(error){
        // 로그아웃 처리 중 오류가 발생하면 에러 메시지 응답
        res.status(500).json({error: "로그아웃 중 오류가 발생했습니다."});
    }
};