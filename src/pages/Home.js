import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bar } from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [valor, setValor] = useState(0);
    const [total, setTotal] = useState(0);
    const [economizou, setEconomizou] = useState(0);

    const loadData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('userData');
            if (userJson) {
                const parsedData = JSON.parse(userJson);
                setUserData(parsedData);
            } else {
                Alert.alert('Aviso', 'Nenhum dado de usuário encontrado no armazenamento.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao carregar dados do usuário.');
            console.error("Erro ao carregar dados: ", error);
        }
    };

    const fetchDespesas = async () => {
        if (userData?.token) {
            try {
                const response = await fetch('http://192.168.0.12:9002/despesa/current-month', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    }
                });
                if (response.ok) {
                    const valorAtual = await response.json();
                    setValor(Number(valorAtual)); 
                } else {
                    console.error("Erro ao buscar despesas: ", response.statusText);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do backend: ", error);
            }
        }
    };

    const fetchLimites = async () => {
        if (userData?.token) {
            try {
                const response = await fetch('http://192.168.0.12:9002/limite/current-month', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    }
                });
                if (response.ok) {
                    const totalAtual = await response.json();
                    setTotal(Number(totalAtual)); 
                } else {
                    console.error("Erro ao buscar limites: ", response.statusText);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do backend: ", error);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (total > 0 && valor !== null) {
            setEconomizou(total - valor);
        }
    }, [valor, total]);

    useFocusEffect(
        useCallback(() => {
            if (userData) {
                fetchDespesas();
                fetchLimites();
            }
        }, [userData, fetchDespesas, fetchLimites])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Olá {userData ? userData.name : "Carregando..."}</Text>
            <Text style={styles.subtitle}>É bom ter você por aqui</Text>
            <View style={styles.box}>
                <Text style={styles.boxText}>Continue assim!</Text>
                <Text style={styles.textEco}>Você economizou R${economizou}</Text>
            </View>
            <Text style={styles.progress}>Progresso</Text>
            <Text>R${valor}/R${total}</Text>
            <Bar
                progress={total > 0 ? valor / total : 0}
                width={300}
                height={20}
                borderRadius={12}
                color='#4EB758'
                unfilledColor='#e0e0e0'
                borderWidth={0}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 22,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 16
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16
    },
    box: {
        backgroundColor: '#4CAF50',
        width: '80%',
        padding: 20,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24
    },
    boxText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    progress: {
        marginTop: 12
    },
    textEco: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF'
    }
});
