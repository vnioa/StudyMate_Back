import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const FirstScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>StudyMate</Text>
            <Image source={require('../assets/studying.png')} style={styles.logo} />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUpScreen')}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8', // 밝은 블루 그레이 톤의 배경색
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#333',
        marginBottom: 50,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 60,
        resizeMode: 'contain',
    },
    buttonContainer: {
        width: '80%',
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#007bff', // 파란색 로그인 버튼
        paddingVertical: 15,
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    signUpButton: {
        backgroundColor: '#28a745', // 초록색 회원가입 버튼
        paddingVertical: 15,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
    },
});

export default FirstScreen;