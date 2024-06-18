import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function Perfil({ navigation }) {
    const [userData, setUserData] = useState(null);

    const loadData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('userData');
            if (userJson !== null) {
                setUserData(JSON.parse(userJson)); 
            }
        } catch (error) {
            console.log("Erro ao carregar dados: ", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Carregando...</Text>
            </View>
        );
    }

    const sair = async () => {
        const URL = `http://192.168.0.12:9002/singout`
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
    })
    if (response.ok) {
        navigation.navigate('Login')
    }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Dados</Text>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.data}>{userData.name}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.data}>{userData.email}</Text>
            <Text style={styles.label}>Data de Nascimento</Text>
            <Text style={styles.data}>{new Date(userData.birthday).toLocaleDateString()}</Text>
            <TouchableOpacity style={styles.button} onPress={sair}>
                <Text style={styles.btnText} onPress={sair}>SAIR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 16
    },
    label: {
        fontSize: 20,
        marginBottom: 8
    },
    data : {
        fontSize: 14,
        marginBottom: 12
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        width: '60%',
        height: 40,
    },
    btnText: {
        color: '#FFF'
    }
});
