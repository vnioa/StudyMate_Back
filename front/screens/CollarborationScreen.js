import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';

const CollaborationScreen = () => {
    const [groupMaterials, setGroupMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState('');

    useEffect(() => {
        fetchGroupMaterials();
    }, []);

    // 스터디 그룹 학습 자료 가져오기
    const fetchGroupMaterials = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/group-materials`);
            setGroupMaterials(response.data);
        } catch (error) {
            console.error('그룹 학습 자료를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    // 새로운 자료 추가
    const addMaterial = async () => {
        if (!newMaterial) {
            Alert.alert('자료를 입력해 주세요');
            return;
        }

        try {
            await axios.post(`${process.env.API_URL}/group-materials`, { material: newMaterial });
            setNewMaterial('');
            fetchGroupMaterials(); // 업데이트된 자료를 다시 가져옴
        } catch (error) {
            console.error('자료 추가 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>실시간 협업 학습 자료</Text>

            <FlatList
                data={groupMaterials}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.material}>{item.material}</Text>
                    </View>
                )}
            />

            <TextInput
                style={styles.input}
                placeholder="새 자료 입력"
                value={newMaterial}
                onChangeText={setNewMaterial}
            />

            <TouchableOpacity style={styles.button} onPress={addMaterial}>
                <Text style={styles.buttonText}>자료 추가</Text>
            </TouchableOpacity>
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
    material: {
        fontSize: 18,
    },
    input: {
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
    },
    button: {
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default CollaborationScreen;
