const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
