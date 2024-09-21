const db = require('../config/db');
const bcrypt = require('bcrypt');

// User 모델 정의
const User = {
    // 사용자 생성
    createUser: async (username, password, name, birthDate, phone, email, verificationToken) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `
                INSERT INTO users (username, password, name, birth_date, phone, email, verification_token)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [username, hashedPassword, name, birthDate, phone, email, verificationToken]);
            return result.insertId;
        } catch (error) {
            throw new Error('Failed to create user: ' + error.message);
        }
    },

    // 사용자 조회 (아이디로 조회)
    getUserById: async (userId) => {
        try {
            const query = `SELECT * FROM users WHERE id = ?`;
            const [rows] = await db.query(query, [userId]);
            return rows[0];
        } catch (error) {
            throw new Error('Failed to get user by ID: ' + error.message);
        }
    },

    // 사용자 조회 (아이디 또는 이메일로 조회)
    getUserByUsernameOrEmail: async (identifier) => {
        try {
            const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
            const [rows] = await db.query(query, [identifier, identifier]);
            return rows[0];
        } catch (error) {
            throw new Error('Failed to get user by username or email: ' + error.message);
        }
    },

    // 사용자 업데이트 (비밀번호 변경 포함)
    updateUser: async (userId, updateData) => {
        const { password, name, phone, profilePicture } = updateData;
        let query = `UPDATE users SET `;
        const values = [];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `password = ?, `;
            values.push(hashedPassword);
        }
        if (name) {
            query += `name = ?, `;
            values.push(name);
        }
        if (phone) {
            query += `phone = ?, `;
            values.push(phone);
        }
        if (profilePicture) {
            query += `profile_picture = ?, `;
            values.push(profilePicture);
        }

        query += `updated_at = NOW() WHERE id = ?`;
        values.push(userId);

        try {
            await db.query(query, values);
        } catch (error) {
            throw new Error('Failed to update user: ' + error.message);
        }
    },

    // 사용자 삭제 (회원 탈퇴)
    deleteUser: async (userId) => {
        try {
            // 사용자 관련 모든 기록 삭제 로직 추가
            await db.query(`DELETE FROM messages WHERE sender = ?`, [userId]);
            await db.query(`DELETE FROM posts WHERE user_id = ?`, [userId]);
            await db.query(`DELETE FROM voteslog WHERE user_id = ?`, [userId]);
            await db.query(`DELETE FROM chatparticipants WHERE user_id = ?`, [userId]);
            await db.query(`DELETE FROM users WHERE id = ?`, [userId]);
        } catch (error) {
            throw new Error('Failed to delete user: ' + error.message);
        }
    },

    // 이메일 인증 상태 업데이트
    verifyEmail: async (email) => {
        try {
            const query = `UPDATE users SET is_verified = 1, verification_token = NULL WHERE email = ?`;
            await db.query(query, [email]);
        } catch (error) {
            throw new Error('Failed to verify email: ' + error.message);
        }
    },

    // 사용자 Refresh Token 업데이트
    updateRefreshToken: async (userId, refreshToken) => {
        try {
            const query = `UPDATE users SET refresh_token = ? WHERE id = ?`;
            await db.query(query, [refreshToken, userId]);
        } catch (error) {
            throw new Error('Failed to update refresh token: ' + error.message);
        }
    },

    // 사용자 Refresh Token 제거 (로그아웃 시)
    clearRefreshToken: async (userId) => {
        try {
            const query = `UPDATE users SET refresh_token = NULL WHERE id = ?`;
            await db.query(query, [userId]);
        } catch (error) {
            throw new Error('Failed to clear refresh token: ' + error.message);
        }
    },
};

module.exports = User;
