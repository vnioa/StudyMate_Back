// routers/performanceRouter.js
const express = require('express');
const router = express.Router();
const { getPerformanceData } = require('../controllers/performanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getPerformanceData);

module.exports = router;