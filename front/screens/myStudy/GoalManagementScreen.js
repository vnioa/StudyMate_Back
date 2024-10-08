// screens/GoalManagementScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';

const GoalManagementScreen = () => {
    const [goals, setGoals] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('medium');

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/goals');
            setGoals(response.data.goals);
        } catch (error) {
            console.error('목표 조회 오류:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (currentGoal) {
                await axios.put('http://121.127.165.43:3000/api/goals', {
                    goalId: currentGoal.id,
                    title,
                    description,
                    deadline,
                    priority,
                });
            } else {
                await axios.post('http://121.127.165.43:3000/api/goals', {
                    title,
                    description,
                    deadline,
                    priority,
                });
            }
            setModalVisible(false);
            setCurrentGoal(null);
            clearForm();
            fetchGoals();
        } catch (error) {
            console.error('목표 저장 오류:', error);
        }
    };

    const handleDelete = async (goalId) => {
        try {
            await axios.delete(`http://121.127.165.43:3000/api/goals/${goalId}`);
            fetchGoals();
        } catch (error) {
            console.error('목표 삭제 오류:', error);
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setDeadline('');
        setPriority('medium');
    };

    const renderGoalItem = ({ item }) => (
        <View style={styles.goalItem}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <Text>마감일: {item.deadline}</Text>
            <Text>우선순위: {item.priority}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {
                    setCurrentGoal(item);
                    setTitle(item.title);
                    setDescription(item.description);
                    setDeadline(item.deadline);
                    setPriority(item.priority);
                    setModalVisible(true);
                }}>
                    <Text style={styles.editButton}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteButton}>삭제</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={() => setModalVisible(true)}>
                새 목표 추가
            </Button>
            <FlatList
                data={goals}
                renderItem={renderGoalItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
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
                        label="마감일"
                        value={deadline}
                        onChangeText={setDeadline}
                        style={styles.input}
                    />
                    <TextInput
                        label="우선순위"
                        value={priority}
                        onChangeText={setPriority}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={handleSubmit}>
                        {currentGoal ? '수정' : '추가'}
                    </Button>
                    <Button mode="outlined" onPress={() => {
                        setModalVisible(false);
                        setCurrentGoal(null);
                        clearForm();
                    }}>
                        취소
                    </Button>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    goalItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    editButton: {
        color: 'blue',
        marginRight: 10,
    },
    deleteButton: {
        color: 'red',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
});

export default GoalManagementScreen;