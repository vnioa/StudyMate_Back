// screens/myStudy/StudyMaterialScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, TextInput, Modal, Portal } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const StudyMaterialScreen = () => {
    const [materials, setMaterials] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/study-materials');
            setMaterials(response.data.materials);
        } catch (error) {
            console.error('자료 조회 오류:', error);
        }
    };

    const handleFileSelect = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync();
            if (result.type === 'success') {
                setSelectedFile(result);
            }
        } catch (error) {
            console.error('파일 선택 오류:', error);
        }
    };

    const uploadMaterial = async () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('file', {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: 'application/octet-stream'
        });

        try {
            await axios.post('http://121.127.165.43:3000/api/study-materials/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setModalVisible(false);
            clearForm();
            fetchMaterials();
        } catch (error) {
            console.error('자료 업로드 오류:', error);
        }
    };

    const deleteMaterial = async (materialId) => {
        try {
            await axios.delete(`http://121.127.165.43:3000/api/study-materials/${materialId}`);
            fetchMaterials();
        } catch (error) {
            console.error('자료 삭제 오류:', error);
        }
    };

    const downloadMaterial = async (materialId) => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/study-materials/download/${materialId}`, {
                responseType: 'blob'
            });
            // 여기에 파일 다운로드 로직 구현 (Expo의 FileSystem 사용 등)
        } catch (error) {
            console.error('자료 다운로드 오류:', error);
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setSelectedFile(null);
    };

    const renderMaterialItem = ({ item }) => (
        <View style={styles.materialItem}>
            <Text style={styles.materialTitle}>{item.title}</Text>
            <Text>{item.category}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => downloadMaterial(item.id)}>
                    <Text style={styles.downloadButton}>다운로드</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMaterial(item.id)}>
                    <Text style={styles.deleteButton}>삭제</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={() => setModalVisible(true)}>
                자료 업로드
            </Button>
            <FlatList
                data={materials}
                renderItem={renderMaterialItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TextInput
                            label="제목"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />
                        <TextInput
                            label="설명"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            style={styles.input}
                        />
                        <TextInput
                            label="카테고리"
                            value={category}
                            onChangeText={setCategory}
                            style={styles.input}
                        />
                        <Button mode="outlined" onPress={handleFileSelect}>
                            파일 선택
                        </Button>
                        {selectedFile && <Text>{selectedFile.name}</Text>}
                        <Button mode="contained" onPress={uploadMaterial}>
                            업로드
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    materialItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    materialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    downloadButton: {
        color: 'blue',
        marginRight: 10,
    },
    deleteButton: {
        color: 'red',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    input: {
        marginBottom: 10,
    },
});

export default StudyMaterialScreen;