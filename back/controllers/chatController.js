// chatController.js
const db = require('../config/db'); // executeQuery 함수를 사용하는 비동기 DB 연결 설정
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid'); // 파일명 유니크 처리

// 유효성 검사 오류 처리 함수
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return null;
};

// 채팅 메시지 불러오기
exports.getMessages = async (req, res) => {
    const { chatRoomId } = req.query;

    try {
        const messages = await db.executeQuery(
            `
                SELECT m.id, m.content, m.created_at, u.username AS senderName, u.profile_picture AS senderProfile
                FROM messages m
                JOIN users u ON m.sender = u.id
                WHERE m.chatRoomId = ?
                ORDER BY m.created_at ASC
            `,
            [chatRoomId]
        );
        res.json(messages);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

// 메시지 전송
exports.sendMessage = async (req, res) => {
    const { chatRoomId, content, sender } = req.body;

    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
        const result = await db.executeQuery(
            `
                INSERT INTO messages (chatRoomId, content, sender, created_at)
                VALUES (?, ?, ?, NOW())
            `,
            [chatRoomId, content, sender]
        );

        const newMessage = await db.executeQuery(
            `
                SELECT m.id, m.content, m.created_at, u.username AS senderName, u.profile_picture AS senderProfile
                FROM messages m
                JOIN users u ON m.sender = u.id
                WHERE m.id = ?
            `,
            [result.insertId]
        );

        // Socket.IO 통합: 클라이언트로 메시지 전송
        const io = req.app.get('socketio');
        io.to(chatRoomId).emit('newMessage', newMessage[0]);

        res.json(newMessage[0]);
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

// 메시지 수정
exports.editMessage = async (req, res) => {
    const { messageId, newContent } = req.body;

    try {
        await db.executeQuery(
            `
                UPDATE messages SET content = ?, updated_at = NOW()
                WHERE id = ?
            `,
            [newContent, messageId]
        );

        const updatedMessage = await db.executeQuery(
            `
                SELECT m.id, m.content, m.updated_at, u.username AS senderName, u.profile_picture AS senderProfile
                FROM messages m
                JOIN users u ON m.sender = u.id
                WHERE m.id = ?
            `,
            [messageId]
        );

        const io = req.app.get('socketio');
        io.emit('editedMessage', updatedMessage[0]);

        res.json(updatedMessage[0]);
    } catch (error) {
        console.error('Failed to edit message:', error);
        res.status(500).json({ message: 'Failed to edit message' });
    }
};

// 메시지 삭제
exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        await db.executeQuery('DELETE FROM messages WHERE id = ?', [messageId]);

        const io = req.app.get('socketio');
        io.emit('deletedMessage', { id: messageId });

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Failed to delete message:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
};

// 참여자 목록 불러오기
exports.getParticipants = async (req, res) => {
    const { chatRoomId } = req.query;

    try {
        const participants = await db.executeQuery(
            `
                SELECT u.id, u.username, u.profile_picture
                FROM chat_participants cp
                JOIN users u ON cp.user_id = u.id
                WHERE cp.chatRoomId = ?
            `,
            [chatRoomId]
        );

        res.json({ participants });
    } catch (error) {
        console.error('Failed to fetch participants:', error);
        res.status(500).json({ message: 'Failed to fetch participants' });
    }
};

// 투표 생성
exports.createVote = async (req, res) => {
    const { title, options, chatRoomId } = req.body;

    try {
        const existingVote = await db.executeQuery(
            `
                SELECT * FROM votes WHERE title = ? AND chatRoomId = ?
            `,
            [title, chatRoomId]
        );

        if (existingVote.length > 0) {
            return res.status(400).json({ message: 'Vote with the same title already exists in this chat room' });
        }

        const result = await db.executeQuery(
            `
                INSERT INTO votes (title, chatRoomId, created_at)
                VALUES (?, ?, NOW())
            `,
            [title, chatRoomId]
        );

        const voteId = result.insertId;

        const optionPromises = options.map((option) =>
            db.executeQuery(
                `
                    INSERT INTO vote_options (voteId, option_text)
                    VALUES (?, ?)
                `,
                [voteId, option]
            )
        );

        await Promise.all(optionPromises);

        res.json({ message: 'Vote created successfully' });
    } catch (error) {
        console.error('Failed to create vote:', error);
        res.status(500).json({ message: 'Failed to create vote' });
    }
};

// 투표 참여
exports.vote = async (req, res) => {
    const { voteOptionId, userId } = req.body;

    try {
        const existingVote = await db.executeQuery(
            `
                SELECT * FROM votes_log
                WHERE user_id = ? AND vote_option_id = ?
            `,
            [userId, voteOptionId]
        );

        if (existingVote.length > 0) {
            return res.status(400).json({ message: 'User has already voted' });
        }

        await db.executeQuery(
            `
                INSERT INTO votes_log (user_id, vote_option_id, created_at)
                VALUES (?, ?, NOW())
            `,
            [userId, voteOptionId]
        );

        res.json({ message: 'Voted successfully' });
    } catch (error) {
        console.error('Failed to vote:', error);
        res.status(500).json({ message: 'Failed to vote' });
    }
};

// 투표 결과 가져오기
exports.getVoteResults = async (req, res) => {
    const { voteId } = req.params;

    try {
        const results = await db.executeQuery(
            `
                SELECT vo.option_text, COUNT(vl.id) as votes
                FROM vote_options vo
                LEFT JOIN votes_log vl ON vo.id = vl.vote_option_id
                WHERE vo.voteId = ?
                GROUP BY vo.id
            `,
            [voteId]
        );

        res.json(results);
    } catch (error) {
        console.error('Failed to fetch vote results:', error);
        res.status(500).json({ message: 'Failed to fetch vote results' });
    }
};

// 공지사항 생성
exports.createAnnouncement = async (req, res) => {
    const { title, content, chatRoomId } = req.body;

    try {
        await db.executeQuery(
            `
                INSERT INTO announcements (title, content, chatRoomId, created_at)
                VALUES (?, ?, ?, NOW())
            `,
            [title, content, chatRoomId]
        );

        res.json({ message: 'Announcement created successfully' });
    } catch (error) {
        console.error('Failed to create announcement:', error);
        res.status(500).json({ message: 'Failed to create announcement' });
    }
};

// 공지사항 조회
exports.getAnnouncements = async (req, res) => {
    const { chatRoomId } = req.query;

    try {
        const announcements = await db.executeQuery(
            `
                SELECT * FROM announcements
                WHERE chatRoomId = ?
                ORDER BY created_at DESC
            `,
            [chatRoomId]
        );

        res.json(announcements);
    } catch (error) {
        console.error('Failed to fetch announcements:', error);
        res.status(500).json({ message: 'Failed to fetch announcements' });
    }
};

// 게시글 생성
exports.createPost = async (req, res) => {
    const { title, content, chatRoomId } = req.body;

    try {
        await db.executeQuery(
            `
                INSERT INTO posts (title, content, chatRoomId, created_at)
                VALUES (?, ?, ?, NOW())
            `,
            [title, content, chatRoomId]
        );

        res.json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Failed to create post:', error);
        res.status(500).json({ message: 'Failed to create post' });
    }
};

// 게시글 조회
exports.getPosts = async (req, res) => {
    const { chatRoomId } = req.query;

    try {
        const posts = await db.executeQuery(
            `
                SELECT * FROM posts
                WHERE chatRoomId = ?
                ORDER BY created_at DESC
            `,
            [chatRoomId]
        );

        res.json(posts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

// 메시지 핀 고정
exports.pinMessage = async (req, res) => {
    const { messageId, chatRoomId } = req.body;

    try {
        await db.executeQuery(
            `
                UPDATE messages SET is_pinned = 0
                WHERE chatRoomId = ? AND is_pinned = 1
            `,
            [chatRoomId]
        );

        await db.executeQuery(
            `
                UPDATE messages SET is_pinned = 1
                WHERE id = ?
            `,
            [messageId]
        );

        res.json({ message: 'Message pinned successfully' });
    } catch (error) {
        console.error('Failed to pin message:', error);
        res.status(500).json({ message: 'Failed to pin message' });
    }
};

// 파일 업로드
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { chatRoomId } = req.body;
        const fileUrl = `${process.env.FILE_STORAGE_URL}/${req.file.filename}`;

        await db.executeQuery(
            `
                INSERT INTO files (chatRoomId, fileUrl, originalName, uploaded_at)
                VALUES (?, ?, ?, NOW())
            `,
            [chatRoomId, fileUrl, req.file.originalname]
        );

        res.json({ message: 'File uploaded successfully', fileUrl });
    } catch (error) {
        console.error('Failed to upload file:', error);
        res.status(500).json({ message: 'Failed to upload file' });
    }
};

// Socket.IO 이벤트 처리
module.exports.initializeSocketIO = (io) => {
    io.on('connection', (socket) => {
        console.log('New Socket.IO connection established');

        // 채팅방에 가입
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });

        // 메시지 전송
        socket.on('sendMessage', async (data) => {
            const { chatRoomId, content, sender } = data;

            try {
                const result = await db.executeQuery(
                    `
                        INSERT INTO messages (chatRoomId, content, sender, created_at)
                        VALUES (?, ?, ?, NOW())
                    `,
                    [chatRoomId, content, sender]
                );

                const newMessage = await db.executeQuery(
                    `
                        SELECT m.id, m.content, m.created_at, u.username AS senderName, u.profile_picture AS senderProfile
                        FROM messages m
                        JOIN users u ON m.sender = u.id
                        WHERE m.id = ?
                    `,
                    [result.insertId]
                );

                // 해당 채팅방에 메시지 전송
                io.to(chatRoomId).emit('newMessage', newMessage[0]);
            } catch (error) {
                console.error('Failed to send message:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        // 메시지 수정
        socket.on('editMessage', async (data) => {
            const { messageId, newContent } = data;

            try {
                await db.executeQuery(
                    `
                        UPDATE messages SET content = ?, updated_at = NOW()
                        WHERE id = ?
                    `,
                    [newContent, messageId]
                );

                const updatedMessage = await db.executeQuery(
                    `
                        SELECT m.id, m.content, m.updated_at, u.username AS senderName, u.profile_picture AS senderProfile
                        FROM messages m
                        JOIN users u ON m.sender = u.id
                        WHERE m.id = ?
                    `,
                    [messageId]
                );

                io.emit('editedMessage', updatedMessage[0]);
            } catch (error) {
                console.error('Failed to edit message:', error);
                socket.emit('error', 'Failed to edit message');
            }
        });

        // 메시지 삭제
        socket.on('deleteMessage', async (data) => {
            const { messageId } = data;

            try {
                await db.executeQuery('DELETE FROM messages WHERE id = ?', [messageId]);
                io.emit('deletedMessage', { id: messageId });
            } catch (error) {
                console.error('Failed to delete message:', error);
                socket.emit('error', 'Failed to delete message');
            }
        });

        // 연결 해제 처리
        socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });
    });
};
