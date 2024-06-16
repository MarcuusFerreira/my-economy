import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DespesaCard from '../components/DespesaCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Despesa() {
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

    const [open, setOpen] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [mes, setMes] = useState(null);
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

    const register = async () => {
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }
        const body = {
            userId: userData.id,
            descricao: descricao,
            valor: valor,
            mesReferencia: `2024-${mes}`
        }
        const response = await fetch('http://localhost:9002/despesa/register', {
            method: 'POST',
            headers: header,
            body: body
        })
        if (response.ok) {
            const json = response.json()
            console.log(json)
        } else {

        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Despesa</Text>
            <TextInput
                style={styles.input}
                onChangeText={setDescricao}
                value={descricao}
                placeholder="Descrição"
                keyboardType="default" // Ajuste o tipo de teclado para texto
            />
            <TextInput
                style={styles.input}
                onChangeText={setValor}
                value={valor}
                placeholder="Valor"
                keyboardType="numeric" // Ajuste o tipo de teclado para número
            />
            <DropDownPicker
                open={open}
                value={mes}
                items={items}
                setOpen={setOpen}
                setValue={setMes}
                setItems={setItems}
                placeholder="Selecione um mês"
                style={styles.dropdown} // Adicione estilo ao DropDownPicker
            />
            <TouchableOpacity style={styles.btn} onPress={register}>
                <Text style={styles.btnText}>Salvar</Text>
            </TouchableOpacity>
            <View style={styles.hist}>
                <Text style={styles.histTitle}>Histórico</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()} // Converte id para string
                    renderItem={({ item }) => (
                        <DespesaCard
                            name={item.descricao}
                            value={item.valor}
                            onEdit={() => console.log('editar')}
                            onDelete={() => console.log('deletar')}
                        />
                    )}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF',
        marginTop: 30
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 24,
        alignSelf: 'center' // Centraliza o título
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16
    },
    dropdown: {
        marginBottom: 16, // Adiciona margem inferior ao DropDownPicker
    },
    btn: {
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        width: '100%',
        height: 40,
    },
    btnText: {
        color: '#FFF',
        fontWeight: 'bold' // Torna o texto do botão mais destacado
    },
    hist: {
        flex: 1, // Permite que a lista use todo o espaço disponível
        marginTop: 24, // Adiciona margem superior ao histórico
    },
    histTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        alignSelf: 'center' // Centraliza o título do histórico
    },
    flatListContainer: {
        flexGrow: 1 // Garante que a lista ocupe todo o espaço disponível
    }
});
