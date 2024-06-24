import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bar } from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Home({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [valor, setValor] = useState(0);
    const [total, setTotal] = useState(0);
    const [economizou, setEconomizou] = useState(0);
    const [mesSelecionado, setMesSelecionado] = useState('');
    const [mes, setMes] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);

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
                const response = await fetch(`${URL}/despesa/current-month`, {
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
                    Alert.alert("Erro ao buscar despesas", response.statusText);
                }
            } catch (error) {
                Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor para buscar despesas.");
                console.error("Erro ao buscar dados do backend: ", error);
            }
        }
    };

    const fetchFiltro = async () => {
        try {
            const response = await fetch(`http://192.168.0.138:9002/limite/lista-filtro?userId=${userData.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                const formattedData = jsonResponse.map(item => ({
                    label: item.mesAnoText,
                    value: item.mesReferencia
                }));
                setItems(formattedData);
            } else {
                throw new Error("Falha ao buscar dados do filtro.");
            }
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    }

    const fetchLimites = async () => {
        if (userData?.token) {
            try {
                const response = await fetch(`http://192.168.0.138:9002/limite/current-month`, {
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
                    // Alert.alert("Erro ao buscar limites", response.statusText);
                }
            } catch (error) {
                Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor para buscar limites.");
                console.error("Erro ao buscar dados do backend: ", error);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (total > 0 && valor !== null) {
            setEconomizou(Math.max(0, total - valor));
        }
    }, [valor, total]);

    useFocusEffect(
        useCallback(() => {
            if (userData) {
                fetchDespesas();
                fetchLimites();
                fetchFiltro();
            }
        }, [userData])
    );

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>Olá {userData ? userData.name : "Carregando..."} 👋</Text>
                <Text style={styles.subtitle}>É bom te ver por aqui!</Text>
            </View>
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={mes}
                setValue={setMes}
                items={items}
                setItems={setItems}
                placeholder='Selecione um mês'
                style={styles.dropdown}
            />
            <View style={styles.box}>
                <Text style={styles.boxText}>
                    {valor > total ? '😞 Você passou do limite' : '😊 Continue assim!'}
                </Text>
            </View>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressText}>R${valor}/R${total}</Text>
            <Bar
                progress={total > 0 ? valor / total : 0}
                width={300}
                height={20}
                borderRadius={12}
                color={valor > total ? '#FF6347' : '#4EB758'}
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
        padding: 22,
    },
    top: {
        alignItems: 'flex-start',
        width: '100%',
        paddingLeft: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    dropdown: {
        marginBottom: 16
    },
    box: {
        backgroundColor: '#4CAF50',
        width: '80%',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 20,
    },
    boxText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
    }
});
