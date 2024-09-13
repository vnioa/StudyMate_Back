import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const ChattingScreen = ({ navigation }) => {
    const [chatList, setChatList] = useState([]);

    // 서버에서 채팅 목록 가져오기
    const fetchChatList = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/chats`);
            setChatList(response.data.chats);
        } catch (error) {
            console.error('채팅 목록을 불러오는 중 오류 발생:', error);
            Alert.alert('오류', '채팅 목록을 불러오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchChatList();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>채팅방</Text>
            <FlatList
                data={chatList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={() => navigation.navigate('ChatRoomScreen', { chatId: item.id })}
                    >
                        <Image source={require('../assets/chattingList.png')} style={styles.chatIcon} />
                        <View style={styles.chatTextContainer}>
                            <Text style={styles.chatTitle}>{item.title}</Text>
                            <Text style={styles.chatMessage}>{item.lastMessage}</Text>
                        </View>
                        <Text style={styles.unreadCount}>{item.unreadMessages}</Text>
                    </TouchableOpacity>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    chatIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    chatTextContainer: {
        flex: 1,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatMessage: {
        color: '#666',
    },
    unreadCount: {
        fontSize: 14,
        color: '#fff',
        backgroundColor: '#ff0000',
        borderRadius: 10,
        padding: 5,
    },
});

export default ChattingScreen;
