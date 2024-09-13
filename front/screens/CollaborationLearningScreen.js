// screens/CollaborationLearningScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

const CollaborationLearningScreen = () => {
    const [groupData, setGroupData] = useState([]);

    useEffect(() => {
        fetchGroupData();
    }, []);

    const fetchGroupData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/groups`, {
                headers: { Authorization: `Bearer ${yourToken}` },
            });
            setGroupData(response.data.groups);
        } catch (error) {
            console.error('그룹 데이터를 가져오는 중 오류가 발생했습니다.', error);
            Alert.alert('오류', '그룹 데이터를 가져올 수 없습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>실시간 협업 학습</Text>
            <FlatList
                data={groupData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.groupName}</Text>
                        <Text style={styles.itemDescription}>{item.groupDescription}</Text>
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
        color: '#000',
        textAlign: 'center',
    },
    item: {
        padding: 15,
        backgroundColor: '#f1f1f1',
        marginBottom: 10,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 18,
        color: '#000',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default CollaborationLearningScreen;
