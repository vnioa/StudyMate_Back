// controllers/roomController.js
const Room = require('../models/Room');
const { validationResult } = require('express-validator');

// 채팅방 생성
exports.createRoom = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, isPrivate } = req.body;

    try {
        // 방 생성
        const roomId = await Room.createRoom(name, description, isPrivate);
        res.status(201).json({ message: 'Room created successfully', roomId });
    } catch (error) {
        console.error('Failed to create room:', error);
        res.status(500).json({ message: 'Failed to create room' });
    }
};

// 특정 방 정보 조회
exports.getRoomById = async (req, res) => {
    const { roomId } = req.params;

    try {
        // 방 정보 가져오기
        const room = await Room.getRoomById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        console.error('Failed to fetch room:', error);
        res.status(500).json({ message: 'Failed to fetch room' });
    }
};

// 모든 방 목록 조회 (페이지네이션 포함)
exports.getRooms = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        // 방 목록 가져오기
        const rooms = await Room.getRooms(offset, parseInt(limit));
        res.json(rooms);
    } catch (error) {
        console.error('Failed to fetch rooms:', error);
        res.status(500).json({ message: 'Failed to fetch rooms' });
    }
};

// 방 수정
exports.updateRoom = async (req, res) => {
    const { roomId } = req.params;
    const { name, description, isPrivate } = req.body;

    try {
        // 기존 방 확인
        const room = await Room.getRoomById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // 방 수정
        await Room.updateRoom(roomId, name, description, isPrivate);
        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error('Failed to update room:', error);
        res.status(500).json({ message: 'Failed to update room' });
    }
};

// 방 삭제
exports.deleteRoom = async (req, res) => {
    const { roomId } = req.params;

    try {
        // 방 확인
        const room = await Room.getRoomById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // 방 삭제
        await Room.deleteRoom(roomId);
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Failed to delete room:', error);
        res.status(500).json({ message: 'Failed to delete room' });
    }
};

// 참여자 추가
exports.addParticipant = async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;

    try {
        // 참여자 추가
        await Room.addParticipant(roomId, userId);
        res.json({ message: 'Participant added successfully' });
    } catch (error) {
        console.error('Failed to add participant:', error);
        res.status(500).json({ message: 'Failed to add participant' });
    }
};

// 참여자 제거
exports.removeParticipant = async (req, res) => {
    const { roomId, userId } = req.body;

    try {
        // 참여자 확인
        const participant = await Room.checkParticipant(roomId, userId);
        if (!participant) {
            return res.status(404).json({ message: 'Participant not found in the room' });
        }

        // 참여자 제거
        await Room.removeParticipant(roomId, userId);
        res.json({ message: 'Participant removed successfully' });
    } catch (error) {
        console.error('Failed to remove participant:', error);
        res.status(500).json({ message: 'Failed to remove participant' });
    }
};

// 비공개 방에 참가 시 접근 권한 확인
exports.joinRoom = async (req, res) => {
    const { roomId, userId } = req.body;

    try {
        // 방 정보 가져오기
        const room = await Room.getRoomById(roomId);
        if (room.isPrivate) {
            // 비공개 방 참여 확인
            const isParticipant = await Room.checkParticipant(roomId, userId);
            if (!isParticipant) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        // 방에 참여
        await Room.addParticipant(roomId, userId);
        res.json({ message: 'Joined the room successfully' });
    } catch (error) {
        console.error('Failed to join room:', error);
        res.status(500).json({ message: 'Failed to join room' });
    }
};

// 특정 방의 모든 참여자 조회
exports.getParticipants = async (req, res) => {
    const { roomId } = req.params;

    try {
        // 참여자 목록 가져오기
        const participants = await Room.getParticipants(roomId);
        res.json(participants);
    } catch (error) {
        console.error('Failed to fetch participants:', error);
        res.status(500).json({ message: 'Failed to fetch participants' });
    }
};
