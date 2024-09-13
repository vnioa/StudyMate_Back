import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const MyGroupScreen = ({ navigation }) => {
    const [groupList, setGroupList] = useState([]);

    // 서버에서 그룹 목록 가져오기
    const fetchGroupList = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/groups`);
            setGroupList(response.data.groups);
        } catch (error) {
            console.error('그룹 목록을 불러오는 중 오류 발생:', error);
            Alert.alert('오류', '그룹 목록을 불러오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchGroupList();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>나의 그룹</Text>
            <FlatList
                data={groupList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.groupItem}
                        onPress={() => navigation.navigate('GroupDetailScreen', { groupId: item.id })}
                    >
                        <Image source={require('../assets/study.png')} style={styles.groupIcon} />
                        <View style={styles.groupTextContainer}>
                            <Text style={styles.groupName}>{item.name}</Text>
                            <Text style={styles.groupActivity}>{item.lastActivity}</Text>
                        </View>
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
    groupItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    groupIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    groupTextContainer: {
        flex: 1,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    groupActivity: {
        color: '#666',
    },
});

export default MyGroupScreen;
