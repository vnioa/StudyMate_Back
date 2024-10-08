// ChatroomList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import axios from 'axios';

const ChatroomList = () => {
    const [chatrooms, setChatrooms] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchChatrooms = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://your-server-api/chatrooms');
            setChatrooms(response.data);
        } catch (error) {
            Alert.alert('에러', '채팅방 목록을 불러오는 중 에러가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChatrooms();
    }, []);

    const handleCreateChatroom = () => {
        Alert.prompt('채팅방 생성', '채팅방 이름을 입력하세요.', async (chatroomName) => {
            try {
                await axios.post('https://your-server-api/chatrooms/create', { name: chatroomName });
                fetchChatrooms();
                Alert.alert('채팅방이 생성되었습니다.');
            } catch (error) {
                Alert.alert('에러', '채팅방 생성 중 문제가 발생했습니다.');
            }
        });
    };

    return (
        <View>
            <Button title="채팅방 생성" onPress={handleCreateChatroom} />
            <FlatList
                data={chatrooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                        <Text>{item.unreadMessages} unread messages</Text>
                    </View>
                )}
                refreshing={loading}
                onRefresh={fetchChatrooms}
            />
        </View>
    );
};

export default ChatroomList;
