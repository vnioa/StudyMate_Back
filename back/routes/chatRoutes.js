// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { body, param } = require('express-validator'); // 입력값 검증을 위한 모듈
const multer = require('multer'); // 파일 업로드를 위한 multer 모듈
const path = require('path');

// Multer 설정 - 파일 업로드를 위한 저장소 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 파일 저장 경로
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // 파일 이름을 고유하게 설정
    }
});

const upload = multer({ storage: storage });

// 채팅 메시지 불러오기
router.get(
    '/messages',
    [
        param('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.getMessages
);

// 메시지 전송
router.post(
    '/send',
    [
        body('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number'),
        body('content').notEmpty().withMessage('Message content is required'),
        body('sender').isNumeric().withMessage('Sender ID must be a number')
    ],
    chatController.sendMessage
);

// 메시지 수정
router.put(
    '/edit',
    [
        body('messageId').isNumeric().withMessage('Message ID must be a number'),
        body('newContent').notEmpty().withMessage('New content is required')
    ],
    chatController.editMessage
);

// 메시지 삭제
router.delete(
    '/delete/:messageId',
    [param('messageId').isNumeric().withMessage('Message ID must be a number')],
    chatController.deleteMessage
);

// 참여자 목록 불러오기
router.get(
    '/participants',
    [
        param('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.getParticipants
);

// 투표 생성
router.post(
    '/create-vote',
    [
        body('title').notEmpty().withMessage('Vote title is required'),
        body('options').isArray({ min: 1 }).withMessage('Options must be an array with at least one item'),
        body('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.createVote
);

// 투표 참여
router.post(
    '/vote',
    [
        body('voteOptionId').isNumeric().withMessage('Vote Option ID must be a number'),
        body('userId').isNumeric().withMessage('User ID must be a number')
    ],
    chatController.vote
);

// 투표 결과 가져오기
router.get(
    '/vote-results/:voteId',
    [param('voteId').isNumeric().withMessage('Vote ID must be a number')],
    chatController.getVoteResults
);

// 공지사항 생성
router.post(
    '/create-announcement',
    [
        body('title').notEmpty().withMessage('Announcement title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        body('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.createAnnouncement
);

// 공지사항 조회
router.get(
    '/announcements',
    [
        param('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.getAnnouncements
);

// 게시글 생성
router.post(
    '/create-post',
    [
        body('title').notEmpty().withMessage('Post title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        body('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.createPost
);

// 게시글 조회
router.get(
    '/posts',
    [
        param('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.getPosts
);

// 메시지 핀 고정
router.post(
    '/pin-message',
    [
        body('messageId').isNumeric().withMessage('Message ID must be a number'),
        body('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.pinMessage
);

// 파일 업로드
router.post(
    '/upload-file',
    upload.single('file'), // 단일 파일 업로드
    [
        body('chatRoomId').isNumeric().withMessage('Chat Room ID must be a number')
    ],
    chatController.uploadFile
);

module.exports = router;
