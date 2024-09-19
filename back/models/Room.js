// models/Room.js
const db = require('../config/db'); // DB 연결 설정

// Room 모델
const Room = {};

// 채팅방 생성
Room.createRoom = async (name, description = '', isPrivate = false) => {
    const [result] = await db.query(
        `
        INSERT INTO ChatRooms (name, description, isPrivate, created_at) 
        VALUES (?, ?, ?, NOW())
        `,
        [name, description, isPrivate]
    );
    return result.insertId;
};

// 특정 방 정보 조회
Room.getRoomById = async (roomId) => {
    const [rows] = await db.query(
        `
        SELECT * FROM ChatRooms 
        WHERE id = ?
        `,
        [roomId]
    );
    return rows[0];
};

// 방 목록 조회 (페이지네이션 포함)
Room.getRooms = async (offset, limit) => {
    const [rows] = await db.query(
        `
        SELECT * FROM ChatRooms 
        ORDER BY created_at DESC
        LIMIT ?, ?
        `,
        [offset, limit]
    );
    return rows;
};

// 방 수정
Room.updateRoom = async (roomId, name, description, isPrivate) => {
    await db.query(
        `
        UPDATE ChatRooms 
        SET name = ?, description = ?, isPrivate = ?, updated_at = NOW() 
        WHERE id = ?
        `,
        [name, description, isPrivate, roomId]
    );
};

// 방 삭제
Room.deleteRoom = async (roomId) => {
    await db.query(
        `
        DELETE FROM ChatRooms 
        WHERE id = ?
        `,
        [roomId]
    );
};

// 방에 참여자 추가
Room.addParticipant = async (roomId, userId) => {
    await db.query(
        `
        INSERT INTO ChatParticipants (chatRoomId, user_id, joined_at) 
        VALUES (?, ?, NOW())
        `,
        [roomId, userId]
    );
};

// 방에서 참여자 제거
Room.removeParticipant = async (roomId, userId) => {
    await db.query(
        `
        DELETE FROM ChatParticipants 
        WHERE chatRoomId = ? AND user_id = ?
        `,
        [roomId, userId]
    );
};

// 특정 방의 모든 참여자 조회
Room.getParticipants = async (roomId) => {
    const [rows] = await db.query(
        `
        SELECT u.id, u.username, u.profile_picture 
        FROM ChatParticipants cp 
        JOIN Users u ON cp.user_id = u.id 
        WHERE cp.chatRoomId = ?
        `,
        [roomId]
    );
    return rows;
};

// 참여자 확인 (비공개 방 접근 권한 확인 시 사용)
Room.checkParticipant = async (roomId, userId) => {
    const [rows] = await db.query(
        `
        SELECT * FROM ChatParticipants 
        WHERE chatRoomId = ? AND user_id = ?
        `,
        [roomId, userId]
    );
    return rows.length > 0;
};

module.exports = Room;
