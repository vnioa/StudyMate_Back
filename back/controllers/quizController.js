// controllers/quizController.js
const db = require('../config/db');

exports.createQuiz = async (req, res) => {
    const { title, questions } = req.body;
    const userId = req.user.id;

    try {
        const [result] = await db.execute(
            'INSERT INTO quizzes (user_id, title) VALUES (?, ?)',
            [userId, title]
        );
        const quizId = result.insertId;

        for (let question of questions) {
            await db.execute(
                'INSERT INTO quiz_questions (quiz_id, question, correct_answer, options) VALUES (?, ?, ?, ?)',
                [quizId, question.question, question.correctAnswer, JSON.stringify(question.options)]
            );
        }

        res.status(201).json({ success: true, message: '퀴즈가 생성되었습니다.', quizId });
    } catch (error) {
        console.error('퀴즈 생성 오류:', error);
        res.status(500).json({ success: false, message: '퀴즈 생성에 실패했습니다.' });
    }
};

exports.getQuizzes = async (req, res) => {
    const userId = req.user.id;

    try {
        const [quizzes] = await db.execute(
            'SELECT * FROM quizzes WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.status(200).json({ success: true, quizzes });
    } catch (error) {
        console.error('퀴즈 목록 조회 오류:', error);
        res.status(500).json({ success: false, message: '퀴즈 목록 조회에 실패했습니다.' });
    }
};

exports.getQuizDetails = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.user.id;

    try {
        const [quiz] = await db.execute(
            'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
            [quizId, userId]
        );
        if (quiz.length === 0) {
            return res.status(404).json({ success: false, message: '퀴즈를 찾을 수 없습니다.' });
        }

        const [questions] = await db.execute(
            'SELECT * FROM quiz_questions WHERE quiz_id = ?',
            [quizId]
        );

        res.status(200).json({
            success: true,
            quiz: quiz[0],
            questions: questions.map(q => ({...q, options: JSON.parse(q.options)}))
        });
    } catch (error) {
        console.error('퀴즈 상세 조회 오류:', error);
        res.status(500).json({ success: false, message: '퀴즈 상세 조회에 실패했습니다.' });
    }
};

exports.submitQuizResult = async (req, res) => {
    const { quizId, answers } = req.body;
    const userId = req.user.id;

    try {
        const [questions] = await db.execute(
            'SELECT * FROM quiz_questions WHERE quiz_id = ?',
            [quizId]
        );

        let score = 0;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].correct_answer === answers[i]) {
                score++;
            }
        }

        await db.execute(
            'INSERT INTO quiz_results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)',
            [userId, quizId, score, questions.length]
        );

        res.status(200).json({ success: true, score, totalQuestions: questions.length });
    } catch (error) {
        console.error('퀴즈 결과 제출 오류:', error);
        res.status(500).json({ success: false, message: '퀴즈 결과 제출에 실패했습니다.' });
    }
};