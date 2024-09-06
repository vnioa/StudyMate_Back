// DB와 상호작용하기 위한 pool 가져오기
const pool = require("../../config/db");

// 개인 채팅 메시지 목록을 가져오는 함수
const getPersonalChatMessages = async(req, res) => {
    const {userId, recipientId} = req.params; // URL에서 유저 ID와 수신자 ID를 가져오기

    try{
        // 두 유저 간의 메시지 목록을 시간 순서대로 가져오기
        const [messages] = await pool.query(
            "SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY timestamp ASC",
            [userId, recipientId, recipientId, userId]
        );

        // 가져온 메시지 목록을 클라이언트에 응답
        res.status(200).json({success: true, data: messages});
    }catch(error){
        // 오류 발생 시 에러 메시지 반환
        res.status(500).json({success: false, message: "메시지 가져오기 중 오류가 발생했습니다.", error: error.message});
    }
};

// 개인 채팅 메시지 전송 함수
const sendPersonalMessage = async(req, res) => {
    const {senderId, recipientId, content} = req.body; // 메시지 정보 가져오기(요청 내용)

    // 입력값 검증: 빈 값 또는 잘못된 형식의 데이터가 있는지 확인
    if(!senderId || !recipientId || !content){
        return res.status(400).json({success: false, message: "모든 정보를 올바르게 입력해 주세요."});
    }

    try{
        // 새로운 메시지를 DB에 저장
        await pool.query(
            "INSERT INTO messages (sender_id, recipient_id, content, timestamp, is_read) VALUES (?, ?, ?, NOW(), ?)",
            [senderId, recipientId, content, 0]
        );

        // 메시지 전송 성공 응답을 클라이언트에 보내기
        res.status(201).json({success: true, message: "메시지 전송 성공"});
    }catch(error){
        // 메시지 전송 중 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "메시지 전송 중 오류 발생", error: error.message});
    }
};

// 개인 채팅 메시지를 읽음 처리하는 함수
const markMessageAsRead = async(req, res) => {
    const {messageId} = req.params; // URL에서 메시지 ID 가져오기

    try{
        // 메시지를 읽음 상태로 업데이트
        await pool.query("UPDATE messages SET is_read = 1 WHERE id = ?", [messageId]);

        // 읽음 처리 성공 메시지 반환
        res.status(200).json({success: true, message: "메시지가 읽음 처리되었습니다."});
    }catch(error){
        // 읽음 처리 중 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "메시지 읽음 처리 중 오류가 발생했습니다.", error: error.message});
    }
};

// 개인 채팅 메시지를 삭제하는 함수
const deletePersonalMessage = async(req,res) => {
    const {mesageId} = req.params; // URL에서 메시지 ID 가져오기

    try{
        // 메시지를 DB에서 삭제
        await pool.query("DELETE FROM messages WHERE id = ?", [messageId]);

        // 삭제 성공 메시지 반환
        res.status(200).json({success: true, message: "메시지 삭제 성공"});
    }catch(error){
        // 삭제 중 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "메시지 삭제 중 오류 발생", error: error.message});
    }
};

// 모듈로 내보내기
module.exports = {getPersonalChatMessages, sendPersonalMessage, markMessageAsRead, deletePersonalMessage};