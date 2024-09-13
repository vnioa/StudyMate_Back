import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const FileManagementScreen = () => {
    const [files, setFiles] = useState([]);
    const [storageUsed, setStorageUsed] = useState(0);

    useEffect(() => {
        fetchFiles();
    }, []);

    // 파일 목록과 사용 중인 저장 공간 가져오기
    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user-files`);
            setFiles(response.data.files);
            setStorageUsed(response.data.storageUsed);
        } catch (error) {
            console.error('파일 목록을 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    // 파일 업로드
    const uploadFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

        if (result.type === 'success') {
            try {
                const formData = new FormData();
                formData.append('file', {
                    uri: result.uri,
                    name: result.name,
                    type: result.mimeType,
                });

                await axios.post(`${process.env.API_URL}/upload-file`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                fetchFiles(); // 업로드 후 파일 목록 갱신
            } catch (error) {
                console.error('파일 업로드 중 오류가 발생했습니다:', error);
            }
        }
    };

    // 파일 삭제
    const deleteFile = async (fileId) => {
        try {
            await axios.delete(`${process.env.API_URL}/delete-file/${fileId}`);
            fetchFiles(); // 삭제 후 파일 목록 갱신
        } catch (error) {
            console.error('파일 삭제 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>파일 관리</Text>
            <Text style={styles.storageText}>사용 중인 저장 공간: {storageUsed}MB / 100MB</Text>

            <TouchableOpacity style={styles.uploadButton} onPress={uploadFile}>
                <Text style={styles.buttonText}>파일 업로드</Text>
            </TouchableOpacity>

            <FlatList
                data={files}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.fileItem}>
                        <Text style={styles.fileName}>{item.name}</Text>
                        <TouchableOpacity onPress={() => deleteFile(item.id)}>
                            <Text style={styles.deleteText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    storageText: {
        fontSize: 16,
        marginBottom: 20,
    },
    uploadButton: {
        padding: 15,
        backgroundColor: '#2196F3',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    fileItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fileName: {
        fontSize: 16,
    },
    deleteText: {
        color: '#FF5722',
    },
});

export default FileManagementScreen;
