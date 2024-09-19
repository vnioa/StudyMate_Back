// screens/TaskScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const TaskScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateTask = async () => {
        if (!title || !description) {
            Alert.alert('오류', '모든 필드를 입력해주세요.');
            return;
        }
        try {
            const response = await axios.post(`${process.env.API_URL}/tasks`, { title, description });
            Alert.alert('작업 생성 완료', `작업 "${response.data.title}"이 생성되었습니다.`);
            setTitle('');
            setDescription('');
        } catch (error) {
            Alert.alert('오류', '작업 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>작업 생성</Text>
            <TextInput
                style={styles.input}
                placeholder="작업 제목"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="작업 설명"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
                <Text style={styles.buttonText}>작업 생성</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default TaskScreen;
