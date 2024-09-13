import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MyPageScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>마이페이지</Text>

            <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>계정 정보</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>설정</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionText}>로그아웃</Text>
            </TouchableOpacity>
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
    optionButton: {
        padding: 15,
        backgroundColor: '#6200ee',
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyPageScreen;
