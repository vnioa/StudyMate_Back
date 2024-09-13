import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const StudyCommunityScreen = () => {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        fetchFeed();
    }, []);

    // 커뮤니티 피드 가져오기
    const fetchFeed = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/community-feed`);
            setFeed(response.data);
        } catch (error) {
            console.error('커뮤니티 피드를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 커뮤니티</Text>

            <FlatList
                data={feed}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text>{item.content}</Text>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
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
        fontSize: 24,
        marginBottom: 20,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
});

export default StudyCommunityScreen;
