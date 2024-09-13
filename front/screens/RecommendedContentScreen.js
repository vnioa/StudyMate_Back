// screens/RecommendedContentScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

const RecommendedContentScreen = () => {
    const [contentData, setContentData] = useState([]);

    useEffect(() => {
        fetchRecommendedContent();
    }, []);

    const fetchRecommendedContent = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/recommended-content`, {
                headers: { Authorization: `Bearer ${yourToken}` },
            });
            setContentData(response.data.contents);
        } catch (error) {
            console.error('추천 콘텐츠를 가져오는 중 오류가 발생했습니다.', error);
            Alert.alert('오류', '추천 콘텐츠를 가져올 수 없습니다.');
        }
    };

    const renderContentItem = ({ item }) => (
        <View style={styles.contentItem}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI 추천 학습 콘텐츠</Text>
            <FlatList
                data={contentData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderContentItem}
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
        color: '#000',
        textAlign: 'center',
    },
    contentItem: {
        padding: 15,
        backgroundColor: '#f1f1f1',
        marginBottom: 10,
        borderRadius: 10,
    },
    contentTitle: {
        fontSize: 18,
        color: '#000',
        marginBottom: 5,
    },
    contentDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default RecommendedContentScreen;
