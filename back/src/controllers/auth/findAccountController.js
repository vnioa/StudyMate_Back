// back/src/controllers/auth/findAccountController.js

const pool = require('../../config/db');
const { sendVerificationCode } = require('../../app/utils/emailSender');

exports.findAccount = async (req, res) => {
    const { email } = req.body;

    try {
        const query = `SELECT username FROM users WHERE email = ?`;
        const [rows] = await pool.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: '존재하지 않는 이메일입니다.' });
        }

        // 이메일로 아이디를 전송합니다.
        await sendVerificationCode(email);
        res.status(200).json({ message: '아이디가 이메일로 전송되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
