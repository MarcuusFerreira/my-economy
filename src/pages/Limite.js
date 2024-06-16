import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import MonthCard from '../components/MonthCard';

export default function Limite() {
    const [userData, setUserData] = useState(null);
    const [valor, setValor] = useState('');
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
    const data = [];
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
    const register = async () => {
        const URL = 'http://192.168.0.138:9002/limite/register'
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }
        const body = {
            limite: valor,
            mesReferencia: `2024-${mes}`,
            userId: userData.id
        }
        const response = await fetch(URL, {
            method: 'POST',
            headers: header,
            body: body
        })
        if (response.ok){
            const json = response.json()
            console.log(json)
        } else {
            
        }
    }
    const loadLimit = () => {

    }
    useEffect(() => {
        loadData();
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Limite</Text>
            <TextInput
                style={styles.input}
                onChangeText={setValor}
                value={valor}
                placeholder="Valor"
                keyboardType="numeric"
            />
            <DropDownPicker
                open={open}
                value={mes}
                items={items}
                setOpen={setOpen}
                setValue={setMes}
                setItems={setItems}
                placeholder="Selecione um mês"
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
            />
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText} onPress={register}>Salvar</Text>
            </TouchableOpacity>
            <View style={styles.consulta}>
                <Text style={styles.conText}>Consulta</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MonthCard
                            id={item.id}
                            mesAno={item.mesReferencia} // Ajuste nos props para usar mesAno e valor
                            valor={item.limite}
                            onEdit={() => console.log('editar')}
                            onDelete={() => console.log('deletar')}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        marginTop: 22
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    dropdown: {
        width: '100%',
        marginBottom: 16,
    },
    dropdownContainer: {
        width: '100%',
    },
    btn: {
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    btnText: {
        color: '#FFF',
    },
    consulta: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    conText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
});
