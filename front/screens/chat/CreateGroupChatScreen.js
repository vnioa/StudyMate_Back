import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';

const CreateGroupChatScreen = ({ navigation }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://your-api-url/api/friends');
            setFriends(response.data.friends);
        } catch (error) {
            console.error('친구 목록 조회 오류:', error);
        }
    };

    const toggleFriendSelection = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const createGroupChat = async () => {
        if (groupName.trim() === '' || selectedFriends.length === 0) {
            alert('그룹 이름을 입력하고 최소 1명의 친구를 선택해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://your-api-url/api/chat/create-group', {
                name: groupName,
                participants: selectedFriends
            });
            navigation.navigate('ChatRoom', { chatRoomId: response.data.chatRoomId });
        } catch (error) {
            console.error('그룹 채팅 생성 오류:', error);
            alert('그룹 채팅 생성에 실패했습니다.');
        }
    };

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity
            style={styles.friendItem}
            onPress={() => toggleFriendSelection(item.id)}
        >
            <Checkbox
                status={selectedFriends.includes(item.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleFriendSelection(item.id)}
            />
            <Text style={styles.friendName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="그룹 이름 입력"
                value={groupName}
                onChangeText={setGroupName}
            />
            <Text style={styles.title}>친구 선택</Text>
            <FlatList
                data={friends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity style={styles.createButton} onPress={createGroupChat}>
                <Text style={styles.createButtonText}>그룹 채팅 생성</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    input: {
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    friendName: {
        marginLeft: 10,
        fontSize: 16,
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateGroupChatScreen;