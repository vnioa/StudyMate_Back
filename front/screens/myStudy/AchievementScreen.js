// screens/myStudy/AchievementScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Title, Paragraph, ProgressBar } from 'react-native-paper';
import axios from 'axios';

const AchievementScreen = () => {
    const [achievements, setAchievements] = useState([]);
    const [badges, setBadges] = useState([]);
    const [level, setLevel] = useState({ level: 1, experience: 0 });
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetchAchievements();
        fetchLeaderboard();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/achievements');
            setAchievements(response.data.achievements);
            setBadges(response.data.badges);
            setLevel(response.data.level);
        } catch (error) {
            console.error('성취 데이터 조회 오류:', error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/achievements/leaderboard');
            setLeaderboard(response.data.leaderboard);
        } catch (error) {
            console.error('리더보드 조회 오류:', error);
        }
    };

    const renderAchievementItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
                <ProgressBar progress={item.progress / item.target_value} color="#6200ee" />
                <Text>{`${item.progress} / ${item.target_value}`}</Text>
            </Card.Content>
        </Card>
    );

    const renderBadgeItem = ({ item }) => (
        <View style={styles.badgeItem}>
            <Image source={{ uri: item.image_url }} style={styles.badgeImage} />
            <Text>{item.name}</Text>
        </View>
    );

    const renderLeaderboardItem = ({ item, index }) => (
        <View style={styles.leaderboardItem}>
            <Text>{index + 1}</Text>
            <Text>{item.username}</Text>
            <Text>{`Level ${item.level}`}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>성취 및 보상</Text>

            <View style={styles.levelInfo}>
                <Text style={styles.levelText}>{`Level ${level.level}`}</Text>
                <ProgressBar progress={level.experience / (level.level * 100)} color="#6200ee" style={styles.expBar} />
                <Text>{`${level.experience} / ${level.level * 100} XP`}</Text>
            </View>

            <Text style={styles.sectionTitle}>획득한 배지</Text>
            <FlatList
                data={badges}
                renderItem={renderBadgeItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.sectionTitle}>업적</Text>
            <FlatList
                data={achievements}
                renderItem={renderAchievementItem}
                keyExtractor={(item) => item.id.toString()}
            />

            <Text style={styles.sectionTitle}>리더보드</Text>
            <FlatList
                data={leaderboard}
                renderItem={renderLeaderboardItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        marginBottom: 10,
    },
    levelInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    levelText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    expBar: {
        width: '100%',
        height: 10,
        marginVertical: 10,
    },
    badgeItem: {
        alignItems: 'center',
        marginRight: 10,
    },
    badgeImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    leaderboardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default AchievementScreen;