// models/Chat.js
const db = require('../config/db'); // DB 연결 설정

class Chat {
    // 채팅 메시지 가져오기
    static async getMessages(chatRoomId) {
        try {
            const [messages] = await db.query(
                `
                SELECT m.id, m.content, m.created_at, u.username AS senderName, u.profile_picture AS senderProfile 
                FROM messages m 
                JOIN users u ON m.sender = u.id 
                WHERE m.chatRoomId = ? 
                ORDER BY m.created_at ASC
                `,
                [chatRoomId]
            );
            return messages;
        } catch (error) {
            throw new Error('Failed to fetch messages');
        }
    }

    // 메시지 저장
    static async saveMessage(chatRoomId, content, sender) {
        try {
            const [result] = await db.query(
                `
                INSERT INTO messages (chatRoomId, content, sender, created_at) 
                VALUES (?, ?, ?, NOW())
                `,
                [chatRoomId, content, sender]
            );

            const [newMessage] = await db.query(
                `
                SELECT m.id, m.content, m.created_at, u.username AS senderName, u.profile_picture AS senderProfile 
                FROM messages m 
                JOIN users u ON m.sender = u.id 
                WHERE m.id = ?
                `,
                [result.insertId]
            );

            return newMessage[0];
        } catch (error) {
            throw new Error('Failed to send message');
        }
    }

    // 메시지 수정
    static async editMessage(messageId, newContent) {
        try {
            await db.query(
                `
                UPDATE messages SET content = ?, updated_at = NOW() 
                WHERE id = ?
                `,
                [newContent, messageId]
            );

            const [updatedMessage] = await db.query(
                `
                SELECT m.id, m.content, m.updated_at, u.username AS senderName, u.profile_picture AS senderProfile 
                FROM messages m 
                JOIN users u ON m.sender = u.id 
                WHERE m.id = ?
                `,
                [messageId]
            );

            return updatedMessage[0];
        } catch (error) {
            throw new Error('Failed to edit message');
        }
    }

    // 메시지 삭제
    static async deleteMessage(messageId) {
        try {
            await db.query('DELETE FROM messages WHERE id = ?', [messageId]);
            return { message: 'Message deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete message');
        }
    }

    // 참여자 목록 불러오기
    static async getParticipants(chatRoomId) {
        try {
            const [participants] = await db.query(
                `
                SELECT u.id, u.username, u.profile_picture 
                FROM chat_participants cp 
                JOIN users u ON cp.user_id = u.id 
                WHERE cp.chatRoomId = ?
                `,
                [chatRoomId]
            );
            return participants;
        } catch (error) {
            throw new Error('Failed to fetch participants');
        }
    }

    // 투표 생성
    static async createVote(title, options, chatRoomId) {
        try {
            const [existingVote] = await db.query(
                `
                SELECT * FROM votes WHERE title = ? AND chatRoomId = ?
                `,
                [title, chatRoomId]
            );

            if (existingVote.length > 0) {
                throw new Error('Vote with the same title already exists in this chat room');
            }

            const [result] = await db.query(
                `
                INSERT INTO votes (title, chatRoomId, created_at) 
                VALUES (?, ?, NOW())
                `,
                [title, chatRoomId]
            );

            const voteId = result.insertId;

            const optionPromises = options.map((option) =>
                db.query(
                    `
                    INSERT INTO vote_options (voteId, option_text) 
                    VALUES (?, ?)
                    `,
                    [voteId, option]
                )
            );

            await Promise.all(optionPromises);

            return { message: 'Vote created successfully' };
        } catch (error) {
            throw new Error('Failed to create vote');
        }
    }

    // 투표 참여
    static async vote(voteOptionId, userId) {
        try {
            const [existingVote] = await db.query(
                `
                SELECT * FROM votes_log 
                WHERE user_id = ? AND vote_option_id = ?
                `,
                [userId, voteOptionId]
            );

            if (existingVote.length > 0) {
                throw new Error('User has already voted');
            }

            await db.query(
                `
                INSERT INTO votes_log (user_id, vote_option_id, created_at) 
                VALUES (?, ?, NOW())
                `,
                [userId, voteOptionId]
            );

            return { message: 'Voted successfully' };
        } catch (error) {
            throw new Error('Failed to vote');
        }
    }

    // 투표 결과 가져오기
    static async getVoteResults(voteId) {
        try {
            const [results] = await db.query(
                `
                SELECT vo.option_text, COUNT(vl.id) as votes 
                FROM vote_options vo 
                LEFT JOIN votes_log vl ON vo.id = vl.vote_option_id 
                WHERE vo.voteId = ? 
                GROUP BY vo.id
                `,
                [voteId]
            );
            return results;
        } catch (error) {
            throw new Error('Failed to fetch vote results');
        }
    }

    // 공지사항 생성
    static async createAnnouncement(title, content, chatRoomId) {
        try {
            await db.query(
                `
                INSERT INTO announcements (title, content, chatRoomId, created_at) 
                VALUES (?, ?, ?, NOW())
                `,
                [title, content, chatRoomId]
            );
            return { message: 'Announcement created successfully' };
        } catch (error) {
            throw new Error('Failed to create announcement');
        }
    }

    // 공지사항 조회
    static async getAnnouncements(chatRoomId) {
        try {
            const [announcements] = await db.query(
                `
                SELECT * FROM announcements 
                WHERE chatRoomId = ? 
                ORDER BY created_at DESC
                `,
                [chatRoomId]
            );
            return announcements;
        } catch (error) {
            throw new Error('Failed to fetch announcements');
        }
    }

    // 게시글 생성
    static async createPost(title, content, chatRoomId) {
        try {
            await db.query(
                `
                INSERT INTO posts (title, content, chatRoomId, created_at) 
                VALUES (?, ?, ?, NOW())
                `,
                [title, content, chatRoomId]
            );
            return { message: 'Post created successfully' };
        } catch (error) {
            throw new Error('Failed to create post');
        }
    }

    // 게시글 조회
    static async getPosts(chatRoomId) {
        try {
            const [posts] = await db.query(
                `
                SELECT * FROM posts 
                WHERE chatRoomId = ? 
                ORDER BY created_at DESC
                `,
                [chatRoomId]
            );
            return posts;
        } catch (error) {
            throw new Error('Failed to fetch posts');
        }
    }

    // 메시지 핀 고정
    static async pinMessage(messageId, chatRoomId) {
        try {
            await db.query(
                `
                UPDATE messages SET is_pinned = 0 
                WHERE chatRoomId = ? AND is_pinned = 1
                `,
                [chatRoomId]
            );

            await db.query(
                `
                UPDATE messages SET is_pinned = 1 
                WHERE id = ?
                `,
                [messageId]
            );

            return { message: 'Message pinned successfully' };
        } catch (error) {
            throw new Error('Failed to pin message');
        }
    }

    // 파일 업로드
    static async uploadFile(chatRoomId, fileUrl, originalName) {
        try {
            await db.query(
                `
                INSERT INTO files (chatRoomId, fileUrl, originalName, uploaded_at) 
                VALUES (?, ?, ?, NOW())
                `,
                [chatRoomId, fileUrl, originalName]
            );

            return { message: 'File uploaded successfully', fileUrl };
        } catch (error) {
            throw new Error('Failed to upload file');
        }
    }
}

module.exports = Chat;
