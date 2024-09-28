const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 설정
app.use('/api/users', userRouter);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
