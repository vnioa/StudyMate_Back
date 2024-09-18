import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RTCView, mediaDevices } from 'react-native-webrtc';
import axios from 'axios';

const CallScreen = ({ route }) => {
    const [localStream, setLocalStream] = useState(null); // 로컬 스트림 (사용자)
    const [remoteStream, setRemoteStream] = useState(null); // 원격 스트림 (상대방)
    const [callActive, setCallActive] = useState(false); // 통화 활성화 상태
    const [callQuality, setCallQuality] = useState('Good'); // 통화 품질 상태
    const [callId, setCallId] = useState(route.params.callId); // 서버에서 가져온 통화 ID

    // 서버에서 통화 정보 가져오기
    const fetchCallDetails = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/calls/${callId}`);
            if (response.data) {
                // 서버에서 받은 데이터 처리
                setCallId(response.data.id);
            }
        } catch (error) {
            console.error('통화 정보를 가져오는 중 오류 발생:', error);
            Alert.alert('오류', '통화 정보를 불러오는 데 실패했습니다.');
        }
    };

    // 통화 품질을 서버에 업데이트하는 함수
    const handleQualityChange = async (quality) => {
        setCallQuality(quality);
        try {
            await axios.post(`${process.env.API_URL}/calls/${callId}/quality`, { quality });
        } catch (error) {
            console.error('통화 품질 업데이트 중 오류 발생:', error);
        }
    };

    // 통화 시작 함수
    const startCall = async () => {
        try {
            const stream = await mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setLocalStream(stream); // 로컬 스트림 설정
            // 서버에 통화 시작 요청
            await axios.post(`${process.env.API_URL}/calls/${callId}/start`);
            setCallActive(true); // 통화 활성화
        } catch (error) {
            console.error('통화 시작 중 오류 발생:', error);
            Alert.alert('오류', '통화를 시작하는 데 실패했습니다.');
        }
    };

    // 통화 종료 함수
    const endCall = async () => {
        try {
            await axios.post(`${process.env.API_URL}/calls/${callId}/end`);
            setCallActive(false); // 통화 비활성화
            setLocalStream(null); // 로컬 스트림 해제
            setRemoteStream(null); // 원격 스트림 해제
        } catch (error) {
            console.error('통화 종료 중 오류 발생:', error);
            Alert.alert('오류', '통화를 종료하는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchCallDetails();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.callTitle}>음성/화상 통화</Text>
                <Text>통화 품질: {callQuality}</Text>
            </View>

            {callActive ? (
                <View style={styles.videoContainer}>
                    {localStream && (
                        <RTCView
                            streamURL={localStream.toURL()}
                            style={styles.localVideo}
                        />
                    )}
                    {remoteStream && (
                        <RTCView
                            streamURL={remoteStream.toURL()}
                            style={styles.remoteVideo}
                        />
                    )}
                </View>
            ) : (
                <Text style={styles.inactiveText}>통화가 시작되지 않았습니다.</Text>
            )}

            <View style={styles.controlPanel}>
                <TouchableOpacity style={styles.startButton} onPress={startCall}>
                    <Text style={styles.buttonText}>통화 시작</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.endButton} onPress={endCall}>
                    <Text style={styles.buttonText}>통화 종료</Text>
                </TouchableOpacity>
                <View style={styles.qualitySelector}>
                    <Text>통화 품질 설정:</Text>
                    <TouchableOpacity onPress={() => handleQualityChange('Good')}>
                        <Text style={styles.qualityText}>Good</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleQualityChange('Fair')}>
                        <Text style={styles.qualityText}>Fair</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleQualityChange('Poor')}>
                        <Text style={styles.qualityText}>Poor</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    callTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    videoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    localVideo: { width: '100%', height: '40%', marginBottom: 20 },
    remoteVideo: { width: '100%', height: '40%' },
    inactiveText: { textAlign: 'center', fontSize: 18, color: '#666' },
    controlPanel: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    startButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10 },
    endButton: { backgroundColor: '#f44336', padding: 15, borderRadius: 10 },
    buttonText: { color: '#fff', fontSize: 16 },
    qualitySelector: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    qualityText: { marginHorizontal: 10, color: '#6200EE', fontSize: 16 },
});

export default CallScreen;
