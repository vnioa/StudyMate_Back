import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://yourserver.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.success) {
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (error) {
            Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>로그인</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="아이디"
                placeholderTextColor="#888"
            />

            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="비밀번호"
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.socialLoginContainer}>
                <TouchableOpacity onPress={() => Alert.alert('Google 로그인')}>
                    <Image source={require('../assets/google.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Kakao 로그인')}>
                    <Image source={require('../assets/kakao.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Naver 로그인')}>
                    <Image source={require('../assets/naver.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Instagram 로그인')}>
                    <Image source={require('../assets/instagram.png')} style={styles.socialIcon} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('FindAccountScreen')}>
                <Text style={styles.findText}>아이디/비밀번호 찾기</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
        justifyContent: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 25,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    socialIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    findText: {
        color: '#007bff',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
    },
});

export default LoginScreen;
