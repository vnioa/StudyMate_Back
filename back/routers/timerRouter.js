// routers/timerRouter.js
const express = require('express');
const router = express.Router();
const { startTimer, stopTimer, getTimerHistory } = require('../controllers/timerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/start', startTimer);
router.put('/stop/:sessionId', stopTimer);
router.get('/history', getTimerHistory);

module.exports = router;