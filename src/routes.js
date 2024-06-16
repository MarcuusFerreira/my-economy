import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from './pages/Home'
import Perfil from './pages/Perfil'
import Despesa from './pages/Despesa'
import Limite from './pages/Limite'

import { Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

function Routes() {
    return(
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: '#4CAF50',
                    borderTopWidth: 0,
                    bottom: 14,
                    left: 14,
                    right: 14,
                    elevation: 0,
                    borderRadius: 12
                }
            }}
        >
            <Tab.Screen
            name="Perfil"
            component={Perfil}
            options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <Ionicons name="person" size={size} color={'#FFF'}/>
                    }
                    return <Ionicons name="person-outline" size={size} color={'#D2D2D2'}/>
                } 
            }}
            />
            <Tab.Screen
            name="Home"
            component={Home}
            options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <Ionicons name="home" size={size} color={'#FFF'}/>
                    }
                    return <Ionicons name="home-outline" size={size} color={'#D2D2D2'}/>
                } 
            }}
            />
            <Tab.Screen
            name="Despesa"
            component={Despesa}
            options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <Ionicons name="cash" size={size} color={'#FFF'}/>
                    }
                    return <Ionicons name="cash-outline" size={size} color={'#D2D2D2'}/>
                } 
            }}
            />
            <Tab.Screen
            name="Limite"
            component={Limite}
            options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <Ionicons name="settings" size={size} color={'#FFF'}/>
                    }
                    return <Ionicons name="settings-outline" size={size} color={'#D2D2D2'}/>
                } 
            }}
            />
        </Tab.Navigator>
    )
}

export default Routes;