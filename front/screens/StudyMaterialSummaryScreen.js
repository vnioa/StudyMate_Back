import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const StudyMaterialSummaryScreen = () => {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        fetchMaterials();
    }, []);

    // 자료 요약 데이터 가져오기
    const fetchMaterials = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/study-materials`);
            setMaterials(response.data);
        } catch (error) {
            console.error('자료 요약 데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI가 요약한 학습 자료</Text>

            <FlatList
                data={materials}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.contentTitle}>{item.title}</Text>
                        <Text>{item.summary}</Text>
                        <TouchableOpacity style={styles.detailButton}>
                            <Text style={styles.buttonText}>상세 보기</Text>
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
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default StudyMaterialSummaryScreen;
