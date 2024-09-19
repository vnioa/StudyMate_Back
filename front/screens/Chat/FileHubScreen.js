// screens/FileHubScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Modal, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const FileHubScreen = () => {
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [fileViewType, setFileViewType] = useState('grid'); // 'grid' or 'list'
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showActionModal, setShowActionModal] = useState(false);

    // 서버에서 파일 목록 불러오기
    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/files`);
            setFiles(response.data);
        } catch (error) {
            console.error('Failed to fetch files:', error);
            Alert.alert('오류', '파일을 불러오지 못했습니다.');
        }
    };

    // 파일 검색
    const searchFiles = async (query) => {
        setSearchQuery(query);
        try {
            const response = await axios.get(`${process.env.API_URL}/files/search`, { params: { query } });
            setFiles(response.data);
        } catch (error) {
            console.error('Failed to search files:', error);
            Alert.alert('오류', '파일 검색에 실패했습니다.');
        }
    };

    // 파일 미리보기
    const previewFile = (file) => {
        setSelectedFile(file);
        setShowPreview(true);
    };

    // 파일 다운로드
    const downloadFile = async (fileId) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/files/download/${fileId}`, { responseType: 'blob' });
            // 파일 다운로드 로직 구현
            Alert.alert('성공', '파일이 다운로드되었습니다.');
        } catch (error) {
            console.error('Failed to download file:', error);
            Alert.alert('오류', '파일 다운로드에 실패했습니다.');
        }
    };

    // 파일 삭제
    const deleteFile = async (fileId) => {
        try {
            await axios.delete(`${process.env.API_URL}/files/${fileId}`);
            setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
            Alert.alert('성공', '파일이 삭제되었습니다.');
        } catch (error) {
            console.error('Failed to delete file:', error);
            Alert.alert('오류', '파일 삭제에 실패했습니다.');
        }
    };

    // 다중 파일 선택 및 일괄 작업
    const handleFileSelection = (file) => {
        if (selectedFiles.includes(file.id)) {
            setSelectedFiles(selectedFiles.filter((id) => id !== file.id));
        } else {
            setSelectedFiles([...selectedFiles, file.id]);
        }
    };

    // 파일 관리 액션 수행 (다운로드, 삭제 등)
    const performAction = (action) => {
        if (action === 'download') {
            selectedFiles.forEach((fileId) => downloadFile(fileId));
        } else if (action === 'delete') {
            selectedFiles.forEach((fileId) => deleteFile(fileId));
        }
        setSelectedFiles([]);
        setShowActionModal(false);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <View style={styles.container}>
            {/* 상단 탐색 바 */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="파일 검색"
                    value={searchQuery}
                    onChangeText={searchFiles}
                />
                <TouchableOpacity onPress={() => setFileViewType(fileViewType === 'grid' ? 'list' : 'grid')}>
                    <Icon name={fileViewType === 'grid' ? 'list-outline' : 'grid-outline'} size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* 파일 목록 */}
            <FlatList
                data={files}
                keyExtractor={(item) => item.id.toString()}
                numColumns={fileViewType === 'grid' ? 2 : 1}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={fileViewType === 'grid' ? styles.gridItem : styles.listItem}
                        onPress={() => previewFile(item)}
                        onLongPress={() => handleFileSelection(item)}
                    >
                        <Image source={{ uri: item.thumbnailUrl }} style={styles.fileImage} />
                        <Text style={styles.fileName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.fileList}
            />

            {/* 파일 미리보기 모달 */}
            <Modal visible={showPreview} animationType="slide" onRequestClose={() => setShowPreview(false)}>
                <View style={styles.previewContainer}>
                    {selectedFile && (
                        <>
                            <Image source={{ uri: selectedFile.url }} style={styles.previewImage} />
                            <Text style={styles.fileDetails}>{selectedFile.name}</Text>
                            <Text style={styles.fileDetails}>크기: {selectedFile.size} MB</Text>
                            <TouchableOpacity style={styles.downloadButton} onPress={() => downloadFile(selectedFile.id)}>
                                <Text style={styles.downloadButtonText}>다운로드</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowPreview(false)}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* 파일 액션 모달 */}
            <Modal visible={showActionModal} transparent={true} animationType="slide" onRequestClose={() => setShowActionModal(false)}>
                <View style={styles.actionModal}>
                    <TouchableOpacity onPress={() => performAction('download')}>
                        <Text style={styles.actionText}>다운로드</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => performAction('delete')}>
                        <Text style={styles.actionText}>삭제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowActionModal(false)}>
                        <Text style={styles.actionText}>취소</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginRight: 10,
    },
    fileList: {
        padding: 10,
    },
    gridItem: {
        flex: 1,
        margin: 5,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        padding: 10,
        alignItems: 'center',
    },
    listItem: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    fileImage: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    fileName: {
        fontSize: 14,
        color: '#333',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    previewImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    fileDetails: {
        fontSize: 16,
        color: '#555',
        marginVertical: 5,
    },
    downloadButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    downloadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e63946',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actionModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 18,
        marginVertical: 10,
        color: '#007bff',
    },
});

export default FileHubScreen;
