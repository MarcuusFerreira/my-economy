import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
            if (userJson !== null) {
                const parsedData = JSON.parse(userJson);
                setUserData(parsedData);
                console.log('User data loaded:', parsedData);
            } else {
                console.log('No user data found in AsyncStorage');
            }
        } catch (error) {
            console.error("Erro ao carregar dados: ", error);
        }
    };

    const fetchDespesas = async () => {
        try {
            if (userData && userData.token) {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                };
                const response = await fetch('http://192.168.48.198:9002/despesa/current-month', {
                    method: 'GET',
                    headers: headers
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Despesas:', data);
                    setValor(Number(data)); // Supondo que `valor` seja um campo no objeto `data`
                } else {
                    console.error("Erro ao buscar despesas: ", response.statusText);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do backend: ", error);
        }
    };

    const fetchLimites = async () => {
        try {
            if (userData && userData.token) {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                };
                const response = await fetch('http://192.168.48.198:9002/limite/current-month', {
                    method: 'GET',
                    headers: headers
                });

                console.log(response.status)
                if (response.ok) {
                    const data = await response.json();
                    console.log('Limites:', data);
                    setTotal(Number(data)); // Supondo que `total` seja um campo no objeto `data`
                } else {
                    console.error("Erro ao buscar limites: ", response.statusText);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do backend: ", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (valor !== null && total !== null) {
            calcular();
        }
    }, [valor, total]);

    useFocusEffect(
        useCallback(() => {
            if (userData) {
                fetchDespesas();
                fetchLimites();
            }
        }, [userData])
    );

    const calcular = () => {
        if (total > 0) {
            setEconomizou(total - valor);
        } else {
            setEconomizou(0);
        }
    };

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
