import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const StudyChecklistScreen = () => {
    const [checklist, setChecklist] = useState([]);
    const [newTask, setNewTask] = useState('');

    // 서버에서 체크리스트 가져오기
    const fetchChecklist = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/checklist`);
            setChecklist(response.data);
        } catch (error) {
            console.error('체크리스트를 불러오는 중 오류가 발생했습니다:', error);
        }
    };

    // 새로운 체크리스트 항목 추가
    const addTask = async () => {
        try {
            const response = await axios.post(`${process.env.API_URL}/checklist`, { task: newTask });
            if (response.status === 201) {
                setChecklist([...checklist, { id: response.data.id, task: newTask, completed: false }]);
                setNewTask('');
            }
        } catch (error) {
            console.error('체크리스트 추가 중 오류가 발생했습니다:', error);
        }
    };

    // 체크리스트 항목 완료 처리
    const completeTask = async (id) => {
        try {
            await axios.patch(`${process.env.API_URL}/checklist/${id}`, { completed: true });
            setChecklist(
                checklist.map((item) =>
                    item.id === id ? { ...item, completed: true } : item
                )
            );
        } catch (error) {
            console.error('체크리스트 항목 완료 처리 중 오류가 발생했습니다:', error);
        }
    };

    useEffect(() => {
        fetchChecklist(); // 컴포넌트 로드 시 체크리스트 불러오기
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 체크리스트</Text>

            <FlatList
                data={checklist}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => completeTask(item.id)}
                        style={styles.taskItem}
                    >
                        <Text
                            style={[
                                styles.taskText,
                                item.completed ? styles.completedTask : null,
                            ]}
                        >
                            {item.task}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <TextInput
                style={styles.input}
                placeholder="새로운 할 일 추가"
                value={newTask}
                onChangeText={setNewTask}
            />

            <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>추가하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    taskItem: {
        padding: 15,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        marginBottom: 10
    },
    taskText: { fontSize: 16 },
    completedTask: { textDecorationLine: 'line-through', color: 'gray' },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 20
    },
    addButton: { backgroundColor: '#6200ee', padding: 15, borderRadius: 10, alignItems: 'center' },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default StudyChecklistScreen;
