import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Text style={styles.subtitle}>StudyMate에 오신 것을 환영합니다!</Text>

            {/* 로그아웃 버튼 (예시) */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('LoginScreen')}
            >
                <Text style={styles.buttonText}>로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0057D9',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0057D9',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;
