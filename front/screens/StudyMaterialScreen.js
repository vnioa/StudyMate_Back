import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const StudyMaterialScreen = () => {
    const [files, setFiles] = useState([]);
    const [totalSize, setTotalSize] = useState(0); // 파일 용량 관리

    // 파일 업로드
    const uploadFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
            if (result.type === 'success') {
                // 파일 크기 계산 (MB 단위)
                const fileSizeInMB = result.size / (1024 * 1024);

                if (totalSize + fileSizeInMB > 100) {
                    Alert.alert('저장 용량이 부족합니다. 파일을 삭제하여 공간을 확보하세요.');
                    return;
                }

                const formData = new FormData();
                formData.append('file', {
                    uri: result.uri,
                    name: result.name,
                    type: result.mimeType,
                });

                await axios.post(`${process.env.API_URL}/upload-material`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setFiles([...files, result]);
                setTotalSize(totalSize + fileSizeInMB);
                Alert.alert('파일이 업로드되었습니다.');
            }
        } catch (error) {
            console.error('파일 업로드 중 오류가 발생했습니다:', error);
        }
    };

    // 파일 삭제
    const deleteFile = async (file) => {
        try {
            await axios.delete(`${process.env.API_URL}/delete-material/${file.name}`);
            setFiles(files.filter(f => f.name !== file.name));
            setTotalSize(totalSize - file.size / (1024 * 1024));
            Alert.alert('파일이 삭제되었습니다.');
        } catch (error) {
            console.error('파일 삭제 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 자료 관리</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={uploadFile}>
                <Text style={styles.buttonText}>자료 업로드</Text>
            </TouchableOpacity>

            <FlatList
                data={files}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={styles.fileItem}>
                        <Text>{item.name}</Text>
                        <TouchableOpacity onPress={() => deleteFile(item)}>
                            <Text style={styles.deleteButton}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Text style={styles.totalSize}>총 용량: {totalSize.toFixed(2)}MB / 100MB</Text>
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
    uploadButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    fileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    deleteButton: {
        color: '#f44336',
    },
    totalSize: {
        marginTop: 20,
        fontSize: 16,
    },
});

export default StudyMaterialScreen;
