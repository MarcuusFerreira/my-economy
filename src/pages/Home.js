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
    const [valor, setValor] = useState(132.98);
    const [total, setTotal] = useState(3000);

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

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Olá {userData ? userData.name : "Carregando..."}</Text>
            <Text style={styles.subtitle}>É bom ter você por aqui</Text>
            <View style={styles.box}>
                <Text style={styles.boxText}>Continue assim!</Text>
                <Text style={styles.textEco}>Você economizou R${total - valor}</Text>
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
        height: '20%',
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
