// routes/roomRoutes.js
const express = require('express');
const { check } = require('express-validator');
const roomController = require('../controllers/roomController');

const router = express.Router();

// 채팅방 생성
router.post(
    '/create',
    [
        check('name').notEmpty().withMessage('Room name is required'),
        check('description').optional(),
        check('isPrivate').isBoolean().optional(),
    ],
    roomController.createRoom
);

// 특정 방 정보 조회
router.get('/:roomId', roomController.getRoomById);

// 모든 방 목록 조회 (페이지네이션 포함)
router.get('/', roomController.getRooms);

// 방 수정
router.put(
    '/:roomId',
    [
        check('name').notEmpty().withMessage('Room name is required'),
        check('description').optional(),
        check('isPrivate').isBoolean().optional(),
    ],
    roomController.updateRoom
);

// 방 삭제
router.delete('/:roomId', roomController.deleteRoom);

// 방에 참여자 추가
router.post('/:roomId/participants', [check('userId').notEmpty().withMessage('User ID is required')], roomController.addParticipant);

// 방에서 참여자 제거
router.delete('/participants', [check('roomId').notEmpty(), check('userId').notEmpty()], roomController.removeParticipant);

// 비공개 방에 참가 시 접근 권한 확인 및 참여
router.post('/join', [check('roomId').notEmpty(), check('userId').notEmpty()], roomController.joinRoom);

// 특정 방의 모든 참여자 조회
router.get('/:roomId/participants', roomController.getParticipants);

module.exports = router;
