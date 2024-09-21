import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View } from 'react-native';

// Auth Screens
import LoginScreen from './screens/Auth/LoginScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';

// Home Screens
import HomeScreen from './screens/Home/HomeScreen';
import FirstScreen from './screens/FirstScreen'; // Assuming this is part of the initial flow

// Chat Screens
import ChatMainScreen from './screens/Chat/ChatMainScreen';
import ChatSettingsScreen from './screens/Chat/ChatSettingsScreen';
import DashboardScreen from './screens/Chat/DashboardScreen';
import FileHubScreen from './screens/Chat/FileHubScreen';
import NotificationScreen from './screens/Chat/NotificationScreen';
import TaskScreen from './screens/Chat/TaskScreen';
import ThreadReplyScreen from './screens/Chat/ThreadReplyScreen';
import UserControlDashboardScreen from './screens/Chat/UserControlDashboardScreen';

// Group Screens
import GroupScreen from './screens/Group/GroupScreen';

// MyPage Screens
import MyPageScreen from './screens/MyPage/MyPageScreen';

// Icons for Bottom Tab
import homeIcon from './assets/home.png';
import chatIcon from './assets/conversation.png';
import groupIcon from './assets/meeting.png';
import myPageIcon from './assets/profile.png';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = homeIcon;
                    } else if (route.name === 'Chat') {
                        iconName = chatIcon;
                    } else if (route.name === 'Group') {
                        iconName = groupIcon;
                    } else if (route.name === 'MyPage') {
                        iconName = myPageIcon;
                    }

                    return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chat" component={ChatStackNavigator} />
            <Tab.Screen name="Group" component={GroupScreen} />
            <Tab.Screen name="MyPage" component={MyPageScreen} />
        </Tab.Navigator>
    );
}

// Chat Stack Navigator
function ChatStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ChatMainScreen" component={ChatMainScreen} />
            <Stack.Screen name="ChatSettingsScreen" component={ChatSettingsScreen} />
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
            <Stack.Screen name="FileHubScreen" component={FileHubScreen} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
            <Stack.Screen name="TaskScreen" component={TaskScreen} />
            <Stack.Screen name="ThreadReplyScreen" component={ThreadReplyScreen} />
            <Stack.Screen name="UserControlDashboardScreen" component={UserControlDashboardScreen} />
        </Stack.Navigator>
    );
}

// Root Stack Navigator
function RootStackNavigator() {
    return (
        <Stack.Navigator initialRouteName="FirstScreen">
            <Stack.Screen name="FirstScreen" component={FirstScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <RootStackNavigator />
        </NavigationContainer>
    );
}
