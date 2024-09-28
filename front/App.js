import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IntroScreen from './screens/home/IntroScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import FindIdPasswordScreen from './screens/auth/FindIdPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';
import HomeScreen from './screens/home/HomeScreen'; // 로그인 후 홈 화면

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="IntroScreen">
          <Stack.Screen
              name="IntroScreen"
              component={IntroScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="SignupScreen"
              component={SignupScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="FindIdPasswordScreen"
              component={FindIdPasswordScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
