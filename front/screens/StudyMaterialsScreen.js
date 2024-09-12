import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

const StudyMaterialsScreen = () => {
    // 상태 선언: 파일 목록, 검색어, 남은 용량
    const [materials, setMaterials] = useState([]);
    const [search, setSearch] = useState('');
    const [remainingStorage, setRemainingStorage] = useState(100); // 100MB로 초기화

    // 서버에서 파일 목록 가져오기
    const fetchMaterials = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/materials`);
            setMaterials(response.data);
        } catch (error) {
            console.error("Error fetching materials: ", error);
        }
    };

    // 파일 업로드 함수
    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync();
            if (result.type === 'success') {
                const formData = new FormData();
                formData.append('file', {
                    uri: result.uri,
                    name: result.name,
                    type: result.mimeType
                });

                const response = await axios.post(`${process.env.API_URL}/api/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                fetchMaterials(); // 파일 업로드 후 목록 새로고침
            }
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    };

    // 남은 저장 공간 계산
    const calculateRemainingStorage = () => {
        let usedSpace = materials.reduce((acc, material) => acc + material.size, 0); // 자료들의 용량 합산
        setRemainingStorage(100 - usedSpace);
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    useEffect(() => {
        calculateRemainingStorage();
    }, [materials]);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Upload New Material</Text>
            <Button title="Upload File" onPress={handleFileUpload} />

            <Text style={{ marginTop: 20 }}>Search Materials</Text>
            <TextInput
                placeholder="Enter file name"
                value={search}
                onChangeText={(text) => setSearch(text)}
            />

            <FlatList
                data={materials.filter(material => material.name.includes(search))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <Text>{item.name} - {item.size}MB</Text>
                    </View>
                )}
            />

            <Text style={{ marginTop: 20 }}>Remaining Storage: {remainingStorage}MB</Text>
        </View>
    );
};

export default StudyMaterialsScreen;
