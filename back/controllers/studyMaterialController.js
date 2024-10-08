// controllers/studyMaterialController.js
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.uploadMaterial = async (req, res) => {
    const { title, description, category } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO study_materials (user_id, title, description, category, file_path) VALUES (?, ?, ?, ?, ?)',
            [userId, title, description, category, file.path]
        );
        res.status(201).json({ success: true, message: '자료가 업로드되었습니다.', materialId: result.insertId });
    } catch (error) {
        console.error('자료 업로드 오류:', error);
        res.status(500).json({ success: false, message: '자료 업로드에 실패했습니다.' });
    }
};

exports.getMaterials = async (req, res) => {
    const userId = req.user.id;
    const { category } = req.query;

    try {
        let query = 'SELECT * FROM study_materials WHERE user_id = ?';
        let params = [userId];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY created_at DESC';

        const [materials] = await db.execute(query, params);
        res.status(200).json({ success: true, materials });
    } catch (error) {
        console.error('자료 조회 오류:', error);
        res.status(500).json({ success: false, message: '자료 조회에 실패했습니다.' });
    }
};

exports.deleteMaterial = async (req, res) => {
    const { materialId } = req.params;
    const userId = req.user.id;

    try {
        const [material] = await db.execute('SELECT * FROM study_materials WHERE id = ? AND user_id = ?', [materialId, userId]);

        if (material.length === 0) {
            return res.status(404).json({ success: false, message: '자료를 찾을 수 없습니다.' });
        }

        await db.execute('DELETE FROM study_materials WHERE id = ?', [materialId]);

        // 파일 시스템에서 실제 파일 삭제
        fs.unlinkSync(material[0].file_path);

        res.status(200).json({ success: true, message: '자료가 삭제되었습니다.' });
    } catch (error) {
        console.error('자료 삭제 오류:', error);
        res.status(500).json({ success: false, message: '자료 삭제에 실패했습니다.' });
    }
};

exports.downloadMaterial = async (req, res) => {
    const { materialId } = req.params;
    const userId = req.user.id;

    try {
        const [material] = await db.execute('SELECT * FROM study_materials WHERE id = ? AND user_id = ?', [materialId, userId]);

        if (material.length === 0) {
            return res.status(404).json({ success: false, message: '자료를 찾을 수 없습니다.' });
        }

        res.download(material[0].file_path, material[0].title, (err) => {
            if (err) {
                console.error('파일 다운로드 오류:', err);
                res.status(500).json({ success: false, message: '파일 다운로드에 실패했습니다.' });
            }
        });
    } catch (error) {
        console.error('자료 다운로드 오류:', error);
        res.status(500).json({ success: false, message: '자료 다운로드에 실패했습니다.' });
    }
};