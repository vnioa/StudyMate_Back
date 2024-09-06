const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer'); // multer 추가
const pool = require('./config/db'); // 데이터베이스 연결 풀 가져오기

const app = express();
const port = 3001; // 포트 번호 변경

// JSON 본문 파싱 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// multer 설정
const upload = multer({ dest: 'uploads/' }); // 파일을 'uploads/' 폴더에 저장

// 정적 파일 서빙을 위한 설정
app.use(express.static(path.join(__dirname, 'controllers', 'user')));

// 회원가입 페이지
app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, 'controllers', 'user', 'join.html'));
});

// 로그인 페이지
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'controllers', 'user', 'login.html'));
});

// 루트 페이지
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 회원가입 라우트 (POST /join)
app.post('/join', async (req, res) => {
    const { username, email, password_hash, name, phone_number, birth_date, profile_image, role } = req.body;

    const query = `INSERT INTO users (username, email, password_hash, name, phone_number, birth_date, profile_image, role)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await pool.execute(query, [username, email, password_hash, name, phone_number, birth_date, profile_image, role]);
        res.status(200).json({ message: 'User successfully created!' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Database error occurred' });
    }
});

// 로그인 라우트 (POST /login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        res.json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});