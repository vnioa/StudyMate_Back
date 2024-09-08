import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 각 스크린 파일들을 import 합니다.
import FirstScreen from './screens/FirstScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import FindAccountScreen from './screens/FindAccountScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="FirstScreen"
            screenOptions={{
              headerShown: false, // 헤더를 숨겨 화면을 더 깔끔하게 구성
            }}
        >
          {/* 앱의 첫 화면으로 설정된 FirstScreen */}
          <Stack.Screen name="FirstScreen" component={FirstScreen} />
          {/* 로그인 화면 */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          {/* 회원가입 화면 */}
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          {/* 아이디/비밀번호 찾기 화면 */}
          <Stack.Screen name="FindAccountScreen" component={FindAccountScreen} />
          {/* 비밀번호 재설정 화면 */}
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
