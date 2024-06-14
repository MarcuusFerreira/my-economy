import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';


import Signin from './src/pages/Autenticacao/Signin';
import Signup from './src/pages/Autenticacao/Signup';
import MyTabs from './src/Navegacao/MyTabs';
import ExpensesScreen from './src/pages/Expenses';

// Ativando telas nativas para melhorar a performance
enableScreens();

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} options={{headerShown: false}} />
      <Stack.Screen name="Main" component={MyTabs} />
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
  const isUserLoggedIn = true; // Ajuste isso conforme necessário para simular a autenticação

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default App;
