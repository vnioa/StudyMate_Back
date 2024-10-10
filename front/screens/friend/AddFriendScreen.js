import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const AddFriendScreen = ({ navigation }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const searchFriend = async () => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/friends/search?term=${searchTerm}`);
            if (response.data.users.length > 0) {
                navigation.navigate('SearchResults', { results: response.data.users });
            } else {
                Alert.alert('검색 결과', '해당하는 사용자를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('친구 검색 오류:', error);
            Alert.alert('오류', '친구 검색 중 문제가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="이름, 전화번호, 또는 ID로 검색"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchFriend}>
                <Text style={styles.searchButtonText}>검색</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.qrButton}
                onPress={() => navigation.navigate('QRCodeScanner')}
            >
                <Text style={styles.qrButtonText}>QR 코드로 친구 추가</Text>
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
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    searchButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    qrButton: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    qrButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddFriendScreen;