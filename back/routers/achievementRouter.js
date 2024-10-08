// routers/achievementRouter.js
const express = require('express');
const router = express.Router();
const { getAchievements, updateAchievement, getLeaderboard } = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getAchievements);
router.post('/update', updateAchievement);
router.get('/leaderboard', getLeaderboard);

module.exports = router;