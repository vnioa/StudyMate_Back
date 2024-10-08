// routers/quizRouter.js
const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzes, getQuizDetails, submitQuizResult } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', createQuiz);
router.get('/', getQuizzes);
router.get('/:quizId', getQuizDetails);
router.post('/:quizId/submit', submitQuizResult);

module.exports = router;