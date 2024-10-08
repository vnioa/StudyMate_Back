// FriendList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import axios from 'axios';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFriends = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://your-server-api/friends');
            setFriends(response.data);
        } catch (error) {
            Alert.alert('에러', '친구 목록을 불러오는 중 에러가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    const handleFriendAction = (action, friendId) => {
        Alert.alert(`친구 ${action}`, `${action} 완료.`);
    };

    return (
        <View>
            <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name} - {item.status}</Text>
                        <Button title="삭제" onPress={() => handleFriendAction('삭제', item.id)} />
                        <Button title="차단" onPress={() => handleFriendAction('차단', item.id)} />
                    </View>
                )}
                refreshing={loading}
                onRefresh={fetchFriends}
            />
        </View>
    );
};

export default FriendList;
