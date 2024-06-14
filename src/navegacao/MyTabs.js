import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


import ExpensesScreen from '../pages/Expenses';
import AddExpenseScreen from '../pages/AddExpense';
import SettingsScreen from '../pages/Settings';
import ProfileScreen from '../pages/Profile';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = 'person'; 
          } else if (route.name === 'Expenses') {
            iconName = 'attach-money'; 
          } else if (route.name === 'AddExpense') {
            iconName = 'note-add'; 
          } else if (route.name === 'Settings') {
            iconName = 'settings'; 
          }

         
          return <Icon name={iconName} size={size+10} color={color} />;
        },
        tabBarActiveTintColor: 'green', 
        tabBarInactiveTintColor: 'white', 
        tabBarStyle: { backgroundColor: '#4CAF50' }, 
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Despesas' }} />
      <Tab.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Adicionar' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Tab.Navigator>
  );
}

export default MyTabs;
