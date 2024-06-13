import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Signin from './src/pages/autenticação/Signin';
import Signup from './src/pages/autenticação/Signup';
import { enableScreens } from 'react-native-screens';
import Home from './src/pages/Home';
import MyTabs from './src/navegacao/MyTabs';

import Signin from './src/pages/Autenticacao/Signin';
import Signup from './src/pages/Autenticacao/Signup';
import MyTabs from './src/Navegacao/MyTabs';

const Stack = createStackNavigator();
enableScreens();
function App() {

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function App() {
  const isUserLoggedIn = true; // Ajuste isso para simular o usuário logado

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin">
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Main" component={MyTabs} />
      </Stack.Navigator>
      {isUserLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default App;
