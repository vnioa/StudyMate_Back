import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const FriendProfileScreen = ({ route, navigation }) => {
    const { friendId } = route.params;
    const [friendProfile, setFriendProfile] = useState(null);

    useEffect(() => {
        fetchFriendProfile();
    }, []);

    const fetchFriendProfile = async () => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/friends/${friendId}`);
            setFriendProfile(response.data.profile);
        } catch (error) {
            console.error('친구 프로필 조회 오류:', error);
        }
    };

    if (!friendProfile) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: friendProfile.profileImage }} style={styles.profileImage} />
            <Text style={styles.name}>{friendProfile.name}</Text>
            <Text style={styles.statusMessage}>{friendProfile.statusMessage}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Chat', { friendId: friendId })}
                >
                    <Text style={styles.buttonText}>1:1 채팅</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {/* 음성 통화 기능 구현 */}}
                >
                    <Text style={styles.buttonText}>음성 통화</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {/* 화상 통화 기능 구현 */}}
                >
                    <Text style={styles.buttonText}>화상 통화</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statusMessage: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FriendProfileScreen;