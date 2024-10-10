import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ChatListScreen = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const navigation = useNavigation();

    const fetchChatRooms = useCallback(async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/chat/list');
            setChatRooms(response.data.chatRooms);
        } catch (error) {
            console.error('채팅방 목록 조회 오류:', error);
        }
    }, []);

    useEffect(() => {
        fetchChatRooms();
        const unsubscribe = navigation.addListener('focus', fetchChatRooms);
        return unsubscribe;
    }, [fetchChatRooms, navigation]);

    const renderChatRoom = ({ item }) => (
        <TouchableOpacity
            style={styles.chatRoomItem}
            onPress={() => navigation.navigate('ChatRoom', { chatRoomId: item.id, name: item.name })}
        >
            <Image source={{ uri: item.profile_image }} style={styles.profileImage} />
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.lastMessage}>{item.last_message}</Text>
            </View>
            <View style={styles.chatMeta}>
                <Text style={styles.lastMessageTime}>{new Date(item.last_message_time).toLocaleTimeString()}</Text>
                {item.unread_count > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{item.unread_count}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={chatRooms}
                renderItem={renderChatRoom}
                keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity
                style={styles.newChatButton}
                onPress={() => navigation.navigate('NewChat')}
            >
                <Text style={styles.newChatButtonText}>새 채팅</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    chatRoomItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
        color: '#757575',
        marginTop: 5,
    },
    chatMeta: {
        alignItems: 'flex-end',
    },
    lastMessageTime: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    unreadBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginTop: 5,
    },
    unreadCount: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    newChatButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    newChatButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChatListScreen;