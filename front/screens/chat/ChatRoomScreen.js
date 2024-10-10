import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const ChatRoomScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const route = useRoute();
    const { chatRoomId, name } = route.params;

    const fetchMessages = useCallback(async () => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/chat/${chatRoomId}/messages`);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('메시지 조회 오류:', error);
        }
    }, [chatRoomId]);

    useEffect(() => {
        fetchMessages();
        // 여기에 실시간 메시지 수신을 위한 WebSocket 연결 로직 추가
    }, [fetchMessages]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        try {
            await axios.post(`http://121.127.165.43:3000/api/chat/${chatRoomId}/messages`, {
                content: inputMessage
            });
            setInputMessage('');
            fetchMessages();
        } catch (error) {
            console.error('메시지 전송 오류:', error);
        }
    };

    const renderMessage = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.messageContent}>{item.content}</Text>
            <Text style={styles.messageTime}>{new Date(item.created_at).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                inverted
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    placeholder="메시지를 입력하세요..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>전송</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    messageContainer: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageContent: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        color: '#9E9E9E',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default ChatRoomScreen;