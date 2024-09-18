import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const SecretChatScreen = () => {
    // 상태값: 비밀번호, 메시지, 채팅 목록, 비밀번호 입력 모달
    const [password, setPassword] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [messages, setMessages] = useState([]);
    const [timer, setTimer] = useState(0);
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(true);

    // 서버에서 메시지 및 채팅 데이터 가져오기
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/secret-messages`);
            setMessages(response.data || []);  // 데이터가 없으면 빈 리스트로 가져오기
        } catch (error) {
            console.error('메시지 불러오기 오류:', error);
            Alert.alert('오류', '메시지를 불러오는 중 문제가 발생했습니다.');
        }
    };

    // 비밀번호 검증
    const checkPassword = () => {
        if (inputPassword === password) {
            setPasswordModalVisible(false);
        } else {
            Alert.alert('비밀번호 오류', '잘못된 비밀번호입니다.');
        }
    };

    // 메시지 삭제 로직
    const deleteMessageAfterTimer = (messageId) => {
        setTimeout(() => {
            setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));
            Alert.alert('알림', '메시지가 삭제되었습니다.');
        }, timer * 1000); // 타이머 후 메시지 삭제
    };

    // 서버로 메시지 전송
    const sendMessage = async (newMessage) => {
        try {
            const response = await axios.post(`${process.env.API_URL}/secret-messages`, { message: newMessage });
            setMessages([...messages, response.data]);
            deleteMessageAfterTimer(response.data.id); // 설정한 시간 후 삭제
        } catch (error) {
            console.error('메시지 전송 오류:', error);
            Alert.alert('오류', '메시지를 전송하는 중 문제가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchMessages();  // 컴포넌트 로드 시 메시지 불러오기
    }, []);

    return (
        <View style={styles.container}>
            {/* 비밀번호 입력 모달 */}
            <Modal visible={isPasswordModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>비밀 채팅방 비밀번호 입력</Text>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호를 입력하세요"
                        secureTextEntry
                        value={inputPassword}
                        onChangeText={setInputPassword}
                    />
                    <TouchableOpacity style={styles.passwordButton} onPress={checkPassword}>
                        <Text style={styles.passwordButtonText}>입장하기</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* 채팅 목록 */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text>{item.message}</Text>
                        <Text style={styles.timerText}>타이머: {item.timer}초 후 삭제</Text>
                    </View>
                )}
            />

            {/* 메시지 입력 및 전송 */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="메시지를 입력하세요"
                    onSubmitEditing={(event) => sendMessage(event.nativeEvent.text)}
                />
                <Ionicons name="send" size={24} color="blue" onPress={() => sendMessage()} />
            </View>
        </View>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    passwordInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        width: '80%',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    passwordButton: {
        backgroundColor: '#6200ee',
        padding: 10,
        borderRadius: 5,
    },
    passwordButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    messageContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    timerText: {
        color: 'red',
        fontSize: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    textInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
});

export default SecretChatScreen;
