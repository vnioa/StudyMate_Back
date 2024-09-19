// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendEmail } = require('../config/mailer');
const { generateAccessToken, generateRefreshToken, generateVerificationCode } = require('../utils/authUtils');
const { validationResult } = require('express-validator');

let verificationCodes = {
    findUsername: {}, // 아이디 찾기
    resetPassword: {} // 비밀번호 찾기 및 재설정
};

// -------------------- 회원가입 관련 --------------------

// 아이디 중복 확인
exports.checkUsername = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "아이디를 입력해 주세요" });
    }

    const query = `SELECT id FROM users WHERE username = ?`;
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "서버 오류가 발생했습니다." });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: "이미 사용 중인 아이디입니다." });
        }
        res.status(200).json({ message: "사용 가능한 아이디입니다." });
    });
};

// 회원가입
exports.signup = async (req, res) => {
    const { username, password, confirmPassword, name, birthDate, phone, email } = req.body;

    const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/;

    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: '아이디는 5~16자리 영문+숫자 형식이어야 합니다.' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: '비밀번호는 10~20자리 영문, 숫자, 특수문자를 포함해야 합니다.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();
        const formattedPhone = phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

        const query = `INSERT INTO users (username, password, name, birth_date, phone, email, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(
            query,
            [username, hashedPassword, name, birthDate, formattedPhone, email, verificationCode],
            (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: '아이디 또는 이메일이 이미 존재합니다.' });
                    }
                    return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
                }

                sendEmail(email, 'StudyMate 이메일 인증 코드', `인증 코드는 ${verificationCode}입니다.`, (error) => {
                    if (error) {
                        return res.status(500).json({ error: '이메일 발송 중 오류가 발생했습니다.' });
                    }
                    res.status(201).json({ message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증 코드를 입력해주세요.' });
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

// 이메일 인증 코드 검증
exports.verifyEmail = (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: '이메일과 인증 코드를 입력해주세요.' });
    }

    const query = `SELECT * FROM users WHERE email = ? AND verification_token = ?`;
    db.query(query, [email, code], (err, results) => {
        if (err) {
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: '인증 코드가 일치하지 않습니다.' });
        }

        const updateQuery = `UPDATE users SET email_verified = true, verification_token = NULL WHERE email = ?`;
        db.query(updateQuery, [email], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ error: '이메일 인증 처리 중 오류가 발생했습니다.' });
            }
            res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
        });
    });
};

// -------------------- 로그인/로그아웃 관련 --------------------

// 로그인
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: '아이디와 비밀번호를 입력해 주세요.' });
    }

    try {
        const query = `SELECT * FROM users WHERE username = ?`;
        db.query(query, [username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: '해당 아이디를 찾을 수 없습니다.' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            // 토큰을 DB에 저장하여 세션 관리
            const updateQuery = `UPDATE users SET refresh_token = ? WHERE id = ?`;
            db.query(updateQuery, [refreshToken, user.id], (err) => {
                if (err) {
                    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
                }

                res.status(200).json({
                    message: '로그인 성공',
                    accessToken,
                    refreshToken,
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

// Refresh Token으로 새로운 Access Token 발급
exports.refreshToken = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: '유효하지 않은 Refresh Token입니다.' });
            }

            const accessToken = generateAccessToken(user);
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
};

// 로그아웃
exports.logout = (req, res) => {
    const { id } = req.user;

    const query = `UPDATE users SET refresh_token = NULL WHERE id = ?`;
    db.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: "로그아웃 처리 중 오류가 발생했습니다." });
        }
        res.status(200).json({ message: "로그아웃 완료" });
    });
};

// -------------------- 아이디 찾기 --------------------

exports.sendUsernameVerificationCode = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "이메일을 입력해 주세요." });
    }

    const query = `SELECT username FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "서버 오류가 발생했습니다." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "해당 이메일로 등록된 사용자가 없습니다." });
        }

        const verificationCode = generateVerificationCode();
        verificationCodes.findUsername[email] = verificationCode;

        sendEmail(email, 'StudyMate 아이디 찾기 인증번호', `아이디 찾기 인증번호는 ${verificationCode}입니다.`, (error) => {
            if (error) {
                return res.status(500).json({ error: "이메일 발송 중 오류가 발생했습니다." });
            }

            return res.status(200).json({ message: "인증번호가 이메일로 발송되었습니다." });
        });
    });
};

exports.verifyUsernameCode = (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ error: "이메일과 인증번호를 모두 입력해 주세요." });
    }

    if (verificationCodes.findUsername[email] !== verificationCode) {
        return res.status(400).json({ error: "인증번호가 일치하지 않습니다." });
    }

    const query = `SELECT username FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "서버 오류가 발생했습니다." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "해당 이메일로 등록된 아이디가 없습니다." });
        }

        const username = results[0].username;
        return res.status(200).json({ message: `아이디는 ${username}입니다.` });
    });
};

// -------------------- 비밀번호 찾기 및 재설정 --------------------

exports.sendPasswordResetCode = (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "아이디와 이메일을 모두 입력해 주세요." });
    }

    const query = `SELECT id FROM users WHERE username = ? AND email = ?`;
    db.query(query, [username, email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "서버 오류가 발생했습니다." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "해당 아이디와 이메일이 일치하는 사용자가 없습니다." });
        }

        const verificationCode = generateVerificationCode();
        verificationCodes.resetPassword[email] = verificationCode;

        sendEmail(email, 'StudyMate 비밀번호 재설정 인증번호', `비밀번호 재설정을 위한 인증번호는 ${verificationCode}입니다.`, (error) => {
            if (error) {
                return res.status(500).json({ error: "이메일 발송 중 오류가 발생했습니다." });
            }

            return res.status(200).json({ message: "인증번호가 이메일로 발송되었습니다." });
        });
    });
};

exports.verifyPasswordResetCode = (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ error: "이메일과 인증번호를 모두 입력해 주세요." });
    }

    if (verificationCodes.resetPassword[email] !== verificationCode) {
        return res.status(400).json({ error: "인증번호가 일치하지 않습니다." });
    }

    res.status(200).json({ message: "인증이 완료되었습니다. 비밀번호를 재설정하세요." });
};

exports.resetPassword = async (req, res) => {
    const { username, email, newPassword, confirmPassword } = req.body;

    if (!username || !email || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: "모든 필드를 입력해 주세요." });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다." });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = `UPDATE users SET password = ? WHERE username = ? AND email = ?`;
        db.query(query, [hashedPassword, username, email], (err) => {
            if (err) {
                return res.status(500).json({ error: "비밀번호 재설정 중 오류가 발생했습니다." });
            }

            res.status(200).json({ message: "비밀번호가 성공적으로 재설정되었습니다." });
        });
    } catch (error) {
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
};

// -------------------- 회원탈퇴 및 모든 기록 삭제 --------------------

exports.deleteUser = (req, res) => {
    const { userId } = req.user; // JWT 토큰에서 추출한 사용자 ID

    // 유저와 관련된 모든 활동을 삭제
    const deleteUserActivityQueries = [
        `DELETE FROM voteslog WHERE user_id = ?`,
        `DELETE FROM voteoptions WHERE voteId IN (SELECT id FROM votes WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?))`,
        `DELETE FROM votes WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM posts WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM announcements WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM files WHERE chatRoomId IN (SELECT chatRoomId FROM chatparticipants WHERE user_id = ?)`,
        `DELETE FROM messages WHERE sender = ?`,
        `DELETE FROM chatparticipants WHERE user_id = ?`,
        `DELETE FROM chatrooms WHERE id NOT IN (SELECT DISTINCT chatRoomId FROM chatparticipants)`, // 채팅방에 남은 참가자가 없으면 삭제
    ];

    const deleteUserQuery = `DELETE FROM users WHERE id = ?`;

    // 모든 활동 삭제 실행
    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: '데이터베이스 연결 중 오류가 발생했습니다.' });
        }

        connection.beginTransaction((transactionError) => {
            if (transactionError) {
                connection.release();
                return res.status(500).json({ error: '트랜잭션 시작 중 오류가 발생했습니다.' });
            }

            const executeQueries = deleteUserActivityQueries.map((query) => {
                return new Promise((resolve, reject) => {
                    connection.query(query, [userId], (queryErr) => {
                        if (queryErr) reject(queryErr);
                        else resolve();
                    });
                });
            });

            // 모든 활동 삭제 후 유저 삭제
            Promise.all(executeQueries)
                .then(() => {
                    connection.query(deleteUserQuery, [userId], (deleteErr) => {
                        if (deleteErr) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ error: '회원탈퇴 처리 중 오류가 발생했습니다.' });
                            });
                        }

                        connection.commit((commitErr) => {
                            if (commitErr) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: '커밋 중 오류가 발생했습니다.' });
                                });
                            }

                            connection.release();
                            res.status(200).json({ message: '회원탈퇴가 완료되었습니다. 모든 활동 기록이 삭제되었습니다.' });
                        });
                    });
                })
                .catch((error) => {
                    connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: '회원탈퇴 처리 중 오류가 발생했습니다.' });
                    });
                });
        });
    });
};
