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
        const url = `http://192.168.0.138:9002/singout`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        });
        if (response.ok) {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Dados</Text>
            <View style={styles.containerdata}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.data}>{userData.name}</Text>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.data}>{userData.email}</Text>
                <Text style={styles.label}>Data de Nascimento</Text>
                <Text style={styles.data}>{new Date(userData.birthday).toLocaleDateString()}</Text>
                </View>
            <TouchableOpacity style={styles.button} onPress={sair}>
                <Text style={styles.btnText}>SAIR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#000'
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        color: '#000',
        textAlign: 'left',
        width: '100%'
    },
    containerdata: {
        width: '80%',
        alignItems: 'flex-start'
    },
    data : {
        fontSize: 16,
        marginBottom: 16,
        color: '#000',
        textAlign: 'left',
        width: '100%'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        width: '80%',
        height: 45,
        marginTop: 20,
    },
    btnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    iconText: {
        color: '#FFF',
        fontSize: 24
    }
});
