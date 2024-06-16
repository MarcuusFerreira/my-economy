import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { Bar } from 'react-native-progress';

export default function Home({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [mes, setMes] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Janeiro', value: 1 },
        { label: 'Fevereiro', value: 2 },
        { label: 'Março', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Maio', value: 5 },
        { label: 'Junho', value: 6 },
        { label: 'Julho', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Setembro', value: 9 },
        { label: 'Outubro', value: 10 },
        { label: 'Novembro', value: 11 },
        { label: 'Dezembro', value: 12 }
    ]);
    const [valor, setValor] = useState(1100);
    const total = 1500;

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

    const fetchData = async () => {
        if (userData) {
            const header = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            };
            try {
                const response = await fetch(`http://192.168.0.138:9002/resumo?userId=${userData.id}`, {
                    method: 'GET',
                    headers: header
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setValor(data.valor);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (userData) {
            fetchData();
        }
    }, [userData]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Olá {userData ? userData.name : "Carregando..."}</Text>
            <Text style={styles.subtitle}>É bom ter você por aqui</Text>
            <DropDownPicker
                open={open}
                value={mes}
                items={items}
                setOpen={setOpen}
                setValue={setMes}
                setItems={setItems}
                placeholder="Selecione um mês"
            />
            <View style={styles.box}>
                <Text style={styles.boxText}>Continue assim!</Text>
            </View>
            <Text style={styles.progress}>Progresso</Text>
            <Text>R${valor}/R${total}</Text>
            <Bar
                progress={valor / total} 
                width={300} 
                height={20} 
                borderRadius={12}
                color='#4EB758' 
                unfilledColor='#e0e0e0'
                borderWidth={0}/>
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
        height: '30%',
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
    }
});
