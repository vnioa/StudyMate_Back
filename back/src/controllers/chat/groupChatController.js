// DB와 상호작용하기 위한 pool 가져오기
const pool = require("../../config/db");

// 그룹 채팅방 목록을 가져오는 함수
const getGroupChats = async(req, res) => {
    const {userId} = req.params; // URL에서 사용자 ID 가져오기

    try{
        // 사용자 속한 그룹 채팅방 목록을 가져오기
        const[groups] = await pool.query(
            "SELECT g.* FROM study_groups g JOIN group_members gm ON g.id = gm.group_id WHERE gm.user_id = ?",
            [userId]
        );

        // 그룹 목록을 클라이언트에 응답
        res.status(200).json({success: true, data: study_groups});
    }catch(error){
        // 오류 발생 시 에러 메시지 반환
        res.status(500).json({success: false, message: "그룹 목록 가져오기 중 오류 발생", error: error.message});
    }
};

// 그룹 채팅 메시지 가져오는 함수
const getGroupChatMessages = async(req, res) => {
    const {groupId} = req.params; // URL에서 그룹 ID 가져오기

    try{
        // 해당 그룹 채팅방의 메시지 목록을 시간 순서대로 가져오기
        const [messages] = await pool.query(
            "SELECT * FROM group_messages WHERE group_id = ? ORDER BY timestamp ASC",
            [groupId]
        );

        // 메시지 목록을 클라이언트에 응답
        res.status(200).json({success: true, data: messages});
    }catch(error){
        // 오류 발생 시 에러 메시지 반환
        res.status(500).json({success: false, message: "그룹 메시지 가져오기 중 오류 발생", error: error.message});
    }
};

// 그룹 채팅방에 메시지를 전송하는 함수
const sendGroupMesage = async(req, res) => {
    const {groupId, senderId, content} = req.body; // 요청 본문에서 메시지 정보 가져오기

    // 입력값 검증: 빈 값 또는 잘못된 형식의 데이터가 있는지 확인
    if(!groupId || !senderId || !content) {
        return res.status(400).json({success: false, message: "모든 정보를 올바르게 입력해 주세요"});
    }

    try{
        // 그룹 채팅 메시지를 DB에 저장
        await pool.query(
            "INSERT INTO group_messages (group_id, sender_id, content, timestamp, is_read) VALUES (?, ?, ?, NOW(), ?)",
            [groupId, senderId, content, 0]
        );

        // 메시지 전송 성공 응답을 클라이언트에 보내기
        res.status(201).json({success: true, message: "그룹에 메시지 전송 성공"});
    }catch(error){
        // 메시지 전송 중 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "그룹 메시지 전송 중 오류 발생", error: error.message});
    }
};

// 그룹 채팅방에서 나가기 기능 처리 함수
const leaveGroupChat = async(req, res) => {
    const {groupId, userId} = req.body; // 요청 본문에서 그룹 ID와 유저 ID 가져오기

    try{
        // 사용자를 그룹 채팅방에서 제거
        await pool.query("DELETE FROM group_members WHERE group_id = ? AND user_id = ?", [groupId, userId]);

        // 그룹 나가기 성공 메시지 반환
        res.status(200).json({success: true, message: "그룹 채팅방 나가기 성공"});
    }catch(error){
        // 그룹 나가기 중 오류 발생 시 에러 메시지 반환
        res.status(500).json({success: false, message: "그룹 채팅방 나가기 중 오류 발생", error: error.message});
    }
};

// 모듈로 내보내기
module.exports = {getGroupChats, getGroupChatMessages, sendGroupMesage, leaveGroupChat};