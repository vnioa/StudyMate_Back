// DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import axios from 'axios';

const DashboardScreen = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    if (!dashboardData) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {dashboardData.userName}!</Text>

            <Card style={styles.card}>
                <Card.Title title="Today's Learning Summary" />
                <Card.Content>
                    <ProgressBar progress={dashboardData.todayProgress} color="#6200ee" />
                    <Text>Time spent: {dashboardData.todayTimeSpent} hours</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Weekly Goal Progress" />
                <Card.Content>
                    <ProgressBar progress={dashboardData.weeklyGoalProgress} color="#03dac6" />
                    <Text>{dashboardData.weeklyGoalProgress * 100}% completed</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Upcoming Schedule" />
                <Card.Content>
                    {dashboardData.upcomingSchedule.map((item, index) => (
                        <Text key={index}>{item.time}: {item.task}</Text>
                    ))}
                </Card.Content>
            </Card>

            <TouchableOpacity style={styles.button} onPress={() => {/* Navigate to start learning */}}>
                <Text style={styles.buttonText}>Start Learning</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#6200ee',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DashboardScreen;