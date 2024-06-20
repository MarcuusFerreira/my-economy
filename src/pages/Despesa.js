import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DespesaCard from '../components/DespesaCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EdicaoDespesa from './edicaoDespesa';
const [editModalVisible, setEditModalVisible] = useState(false);
const [currentDespesa, setCurrentDespesa] = useState(null);

export default function Despesa() {
    const [userData, setUserData] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [mes, setMes] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Janeiro/2024', value: '2024-01' },
        { label: 'Fevereiro/2024', value: '2024-02' },
        { label: 'Março/2024', value: '2024-03' },
        { label: 'Abril/2024', value: '2024-04' },
        { label: 'Maio/2024', value: '2024-05' },
        { label: 'Junho/2024', value: '2024-06' },
        { label: 'Julho/2024', value: '2024-07' },
        { label: 'Agosto/2024', value: '2024-08' },
        { label: 'Setembro/2024', value: '2024-09' },
        { label: 'Outubro/2024', value: '2024-10' },
        { label: 'Novembro/2024', value: '2024-11' },
        { label: 'Dezembro/2024', value: '2024-12' },
        { label: 'Janeiro/2026', value: '2025-01' },
        { label: 'Fevereiro/2025', value: '2025-02' },
        { label: 'Março/2025', value: '2025-03' },
        { label: 'Abril/2025', value: '2025-04' },
        { label: 'Maio/2025', value: '2025-05' },
        { label: 'Junho/2025', value: '2025-06' },
        { label: 'Julho/2025', value: '2025-07' },
        { label: 'Agosto/2025', value: '2025-08' },
        { label: 'Setembro/2025', value: '2025-09' },
        { label: 'Outubro/2025', value: '2025-10' },
        { label: 'Novembro/2025', value: '2025-11' },
        { label: 'Dezembro/2025', value: '2025-12' }
    ]);
    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('userData');
            if (userJson !== null) {
                setUserData(JSON.parse(userJson));
            } else {
                console.log('Nenhum dado encontrado no AsyncStorage');
            }
        } catch (error) {
            console.log("Erro ao carregar dados: ", error);
        }
    };

    useEffect(() => {
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
        loadData();
    }, []);

    useEffect(() => {
        if (userData) {
            fetchDespesas();
        }
    }, [userData]);

    const fetchDespesas = async () => {
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        };
        try {
            const response = await fetch(`http://192.168.0.12:9002/despesa/get?userId=${userData.id}`, {
                method: 'GET',
                headers: header
            });
            if (response.ok) {
                const json = await response.json();
                setData(json);
            } else {
                console.log('Erro ao buscar despesas', response.status);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const register = async () => {
        if (!mes) {
            Alert.alert("Erro", "Por favor, selecione um mês.");
            return;
        }
        const body = {
            userId: userData.id,
            descricao: descricao,
            valor: valor,
            mesReferencia: mes
        };
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        };
        try {
            const response = await fetch('http://192.168.0.12:9002/despesa/register', {
                method: 'POST',
                headers: header,
                body: JSON.stringify(body)
            });
            if (response.ok) {
                setDescricao('');
                setMes(null);
                setValor('');
                fetchDespesas();
            } else {
                console.log('Erro ao registrar despesa', response.status);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const remover = (id) => {
        Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir esta despesa?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => confirmDelete(id) }
            ]
        );
    };

    const confirmDelete = async (id) => {
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        };
        try {
            const response = await fetch(`http://192.168.0.12:9002/despesa/remove?id=${id}`, {
                method: 'DELETE',
                headers: header
            });
            if (response.ok) {
                Alert.alert("Despesa Removida", "Despesa removida com sucesso!");
                fetchDespesas();
            } else {
                Alert.alert("Erro", 'Erro ao remover despesa: ' + response.statusText);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            Alert.alert("Erro", "Falha na conexão com o servidor");
        }
    };
    

    return (
        <View style={styles.container}>
            <EdicaoDespesa
                visible={editModalVisible}
                onClose={closeEditModal}
                despesa={currentDespesa}
                onSave={handleSaveDespesa}
                items={items}
            />
            <Text style={styles.title}>Despesa</Text>
            <TextInput
                style={styles.input}
                onChangeText={setDescricao}
                value={descricao}
                placeholder="Descrição"
                keyboardType="default"
            />
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
            />
            <TouchableOpacity style={styles.btn} onPress={register}>
                <Text style={styles.btnText}>Salvar</Text>
            </TouchableOpacity>
            <View style={styles.hist}>
                <Text style={styles.histTitle}>Histórico</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <DespesaCard
                            name={item.descricao}
                            value={item.valor}
                            onEdit={() => openEditModal(item)}
                            onDelete={() => remover(item.id)}
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
        alignSelf: 'center'
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
        marginBottom: 16
    },
    btn: {
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        width: '100%',
        height: 40
    },
    btnText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    hist: {
        flex: 1,
        marginTop: 24
    },
    histTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        alignSelf: 'center'
    },
    flatListContainer: {
        flexGrow: 1
    }
});
