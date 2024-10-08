// screens/myStudy/QuizScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, TextInput, Modal, Portal } from 'react-native-paper';
import axios from 'axios';

const QuizScreen = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizResults, setQuizResults] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/quizzes');
            setQuizzes(response.data.quizzes);
        } catch (error) {
            console.error('퀴즈 목록 조회 오류:', error);
        }
    };

    const createQuiz = async () => {
        try {
            await axios.post('http://121.127.165.43:3000/api/quizzes', { title: quizTitle, questions });
            setModalVisible(false);
            setQuizTitle('');
            setQuestions([]);
            fetchQuizzes();
        } catch (error) {
            console.error('퀴즈 생성 오류:', error);
        }
    };

    const startQuiz = async (quizId) => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/quizzes/${quizId}`);
            setCurrentQuiz(response.data);
        } catch (error) {
            console.error('퀴즈 상세 조회 오류:', error);
        }
    };

    const submitQuiz = async (answers) => {
        try {
            const response = await axios.post(`http://121.127.165.43:3000/api/quizzes/${currentQuiz.quiz.id}/submit`, { answers });
            setQuizResults(response.data);
            setCurrentQuiz(null);
        } catch (error) {
            console.error('퀴즈 결과 제출 오류:', error);
        }
    };

    const renderQuizItem = ({ item }) => (
        <TouchableOpacity onPress={() => startQuiz(item.id)}>
            <View style={styles.quizItem}>
                <Text>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={() => setModalVisible(true)}>
                새 퀴즈 만들기
            </Button>
            <FlatList
                data={quizzes}
                renderItem={renderQuizItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TextInput
                            label="퀴즈 제목"
                            value={quizTitle}
                            onChangeText={setQuizTitle}
                        />
                        {/* 여기에 문제 추가 UI를 구현하세요 */}
                        <Button mode="contained" onPress={createQuiz}>
                            퀴즈 생성
                        </Button>
                    </View>
                </Modal>
            </Portal>
            {currentQuiz && (
                <View>
                    {/* 여기에 퀴즈 풀기 UI를 구현하세요 */}
                </View>
            )}
            {quizResults && (
                <View>
                    <Text>점수: {quizResults.score} / {quizResults.totalQuestions}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    quizItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
});

export default QuizScreen;