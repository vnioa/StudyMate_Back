// FileMediaManagerScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';

// 파일 미리보기 팝업
const FilePreview = ({ file, onClose }) => (
    <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>파일 미리보기</Text>
        {file.type === 'image' ? (
            <Image source={{ uri: file.url }} style={styles.imagePreview} />
        ) : (
            <Text style={styles.fileInfo}>{file.name}</Text>
        )}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
    </View>
);

const FileMediaManagementScreen = () => {
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filterType, setFilterType] = useState('all'); // 기본 필터는 '전체'
    const [uploadProgress, setUploadProgress] = useState(0);

    // 서버에서 파일 목록 가져오기
    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/files`);
            setFiles(response.data || []); // 파일 목록이 없으면 빈 배열 처리
        } catch (error) {
            console.error("파일을 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    // 필터링된 파일 목록 생성
    useEffect(() => {
        if (filterType === 'all') {
            setFilteredFiles(files);
        } else {
            const filtered = files.filter((file) => file.type === filterType);
            setFilteredFiles(filtered);
        }
    }, [filterType, files]);

    // 파일 업로드 핸들러
    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${process.env.API_URL}/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
            if (response.status === 200) {
                setFiles([...files, response.data]); // 업로드 성공 후 파일 목록 갱신
            }
        } catch (error) {
            console.error("파일 업로드 중 오류가 발생했습니다:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>파일 및 미디어 관리</Text>

            {/* 필터 버튼 */}
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setFilterType('all')} style={styles.filterButton}>
                    <Text style={styles.filterText}>전체</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterType('image')} style={styles.filterButton}>
                    <Text style={styles.filterText}>이미지</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterType('video')} style={styles.filterButton}>
                    <Text style={styles.filterText}>동영상</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterType('document')} style={styles.filterButton}>
                    <Text style={styles.filterText}>문서</Text>
                </TouchableOpacity>
            </View>

            {/* 파일 목록 */}
            <FlatList
                data={filteredFiles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedFile(item)} style={styles.fileItem}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* 파일 업로드 진행 상태 */}
            {uploadProgress > 0 && uploadProgress < 100 && (
                <View style={styles.uploadProgress}>
                    <Text>업로드 진행: {uploadProgress}%</Text>
                </View>
            )}

            {/* 파일 미리보기 */}
            {selectedFile && <FilePreview file={selectedFile} onClose={() => setSelectedFile(null)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    filterContainer: { flexDirection: 'row', marginBottom: 20 },
    filterButton: { padding: 10, backgroundColor: '#f0f0f0', marginRight: 10, borderRadius: 5 },
    filterText: { fontSize: 16 },
    fileItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    uploadProgress: { marginTop: 10 },
    previewContainer: { padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    previewTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    imagePreview: { width: 200, height: 200, resizeMode: 'contain' },
    fileInfo: { fontSize: 16 },
    closeButton: { padding: 10, backgroundColor: '#6200ee', borderRadius: 5, marginTop: 10 },
    closeButtonText: { color: '#fff' },
});

export default FileMediaManagementScreen;
