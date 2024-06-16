import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/pages/Login';
import Cadastro from './src/pages/Cadastro';
import Routes from './src/routes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }}/>
        <Stack.Screen name="Main" component={Routes} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
