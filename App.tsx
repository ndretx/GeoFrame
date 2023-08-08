import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import CameraComponent from './src/pages/camera-page';
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from './src/pages/home-page';
import LoginPage from './src/pages/login-register';
import chatPage from './src/pages/chat-page';



const Stack = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={({ route }) => ({
          headerShown: false
        })} name="LoginPage" component={LoginPage} />
        <Stack.Screen options={({ route }) => ({
          headerShown: false
        })} name="HomePage" component={HomePage} />
         <Stack.Screen options={({ route }) => ({
          headerShown: false
        })} name="chatPage" component={chatPage} />
        <Stack.Screen options={({ route }) => ({
          headerShown: false
        })} name="CameraComponent" component={CameraComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
