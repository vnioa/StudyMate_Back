// 로그아웃 처리 함수
const logout = (req, res) => {
    // 세션에서 사용자 정보를 제거하고 로그아웃 처리
    req.logout((err) => {
        if(err){
            // 로그아웃 처리 중 오류가 발생한 경우
            return res.status(500).json({success: false, message: "로그아웃 중 오류가 발생했습니다.", error: error.message});
        }
        // 로그아웃 성공 시 클라이언트에 응답 보내기
        res.status(200).json({success: true, message: "로그아웃이 완료되었습니다."});
    });
};

// 모듈로 내보내기
module.exports = {logout};