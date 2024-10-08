// Chatroom.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('https://your-server-api');

const Chatroom = ({ route }) => {
    const { chatroomId } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        socket.emit('joinRoom', chatroomId);

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit('leaveRoom', chatroomId);
        };
    }, [chatroomId]);

    const sendMessage = async () => {
        if (inputMessage) {
            try {
                await socket.emit('sendMessage', { message: inputMessage, chatroomId });
                setInputMessage('');
            } catch (error) {
                Alert.alert('메시지 전송 실패', '메시지 전송 중 에러가 발생했습니다.');
            }
        }
    };

    const fetchChatHistory = async () => {
        try {
            const response = await axios.get(`https://your-server-api/chatrooms/${chatroomId}/history`);
            setMessages(response.data);
        } catch (error) {
            Alert.alert('에러', '채팅 기록을 불러오는 중 에러가 발생했습니다.');
        }
    };

    return (
        <View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.sender}: {item.text}</Text>
                    </View>
                )}
            />
            <TextInput
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="메시지 입력"
            />
            <Button title="전송" onPress={sendMessage} />
        </View>
    );
};

export default Chatroom;
