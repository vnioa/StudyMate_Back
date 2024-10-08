// routers/scheduleRouter.js
const express = require('express');
const router = express.Router();
const { getSchedules, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/', updateSchedule);
router.delete('/:scheduleId', deleteSchedule);

module.exports = router;