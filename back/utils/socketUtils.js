// utils/socketUtils.js
const { Server } = require('socket.io');
const db = require('../config/db'); // 데이터베이스 연결 설정

// Socket.IO 서버 초기화 함수
function initializeSocket(server) {
    // HTTP 서버와 함께 사용할 Socket.IO 서버 생성
    const io = new Server(server, {
        cors: {
            origin: '*', // 필요한 CORS 설정
            methods: ['GET', 'POST'],
        },
    });

    // 클라이언트 연결 처리
    io.on('connection', (socket) => {
        console.log('새 클라이언트가 연결되었습니다.');

        // 채팅방에 조인
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`클라이언트가 채팅방 ${roomId}에 참여했습니다.`);
        });

        // 메시지 전송 처리
        socket.on('sendMessage', async (data) => {
            const { chatRoomId, content, sender } = data;

            try {
                // 메시지를 데이터베이스에 저장
                const [result] = await db.query(
                    `INSERT INTO messages (chatRoomId, content, sender, created_at) VALUES (?, ?, ?, NOW())`,
                    [chatRoomId, content, sender]
                );

                // 저장된 메시지를 조회하여 클라이언트에게 전송
                const [newMessage] = await db.query(
                    `SELECT m.id, m.content, m.created_at, u.username AS senderName, u.profile_picture AS senderProfile 
                     FROM messages m JOIN users u ON m.sender = u.id WHERE m.id = ?`,
                    [result.insertId]
                );

                // 해당 채팅방에 메시지를 브로드캐스트
                io.to(chatRoomId).emit('newMessage', newMessage[0]);
            } catch (error) {
                console.error('메시지 저장 중 오류 발생:', error);
                socket.emit('error', '메시지 저장 중 오류가 발생했습니다.');
            }
        });

        // 클라이언트 연결 종료 처리
        socket.on('disconnect', () => {
            console.log('클라이언트 연결이 종료되었습니다.');
        });
    });
}

module.exports = { initializeSocket };
