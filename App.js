import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Signin from './src/pages/autenticação/Signin';
import Signup from './src/pages/autenticação/Signup';
import { enableScreens } from 'react-native-screens';
import Home from './src/pages/Home';
import MyTabs from './src/navegacao/MyTabs';

const Stack = createStackNavigator();
enableScreens();
function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin">
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Main" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
