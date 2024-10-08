// routers/goalRouter.js
const express = require('express');
const router = express.Router();
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/', updateGoal);
router.delete('/:goalId', deleteGoal);

module.exports = router;