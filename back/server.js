const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const dashboardRouter = require('./routers/dashboardRouter');
const goalRouter = require('./routers/goalRouter');
const scheduleRouter = require("./routers/scheduleRouter");
const timerRouter = require("./routers/timerRouter");
const quizRouter = require('./routers/quizRouter');
const studyMaterialRouter = require('./routers/studyMaterialRouter');
const performanceRouter = require('./routers/performanceRouter');
const achievementRouter = require('./routers/achievementRouter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 설정
app.use('/api/users', userRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/goals', goalRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/timer', timerRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/study-materials', studyMaterialRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/achievements', achievementRouter);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
