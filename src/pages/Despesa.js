import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DespesaCard from '../components/DespesaCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Despesa() {
    const [userData, setUserData] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [mes, setMes] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Janeiro', value: '01' },
        { label: 'Fevereiro', value: '02' },
        { label: 'Março', value: '03' },
        { label: 'Abril', value: '04' },
        { label: 'Maio', value: '05' },
        { label: 'Junho', value: '06' },
        { label: 'Julho', value: '07' },
        { label: 'Agosto', value: '08' },
        { label: 'Setembro', value: '09' },
        { label: 'Outubro', value: '10' },
        { label: 'Novembro', value: '11' },
        { label: 'Dezembro', value: '12' }
    ]);
    const [data, setData] = useState([]); // Adiciona o estado para armazenar as despesas

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
        loadData(); // Carregar os dados do usuário ao montar o componente
    }, []);

    useEffect(() => {
        if (userData) {
            fetchDespesas();
        }
    }, [userData]);

    const fetchDespesas = async () => {
        if (userData) {
            const header = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            };

            try {
                const response = await fetch(`http://192.168.0.138:9002/despesa/get?userId=${userData.id}`, {
                    method: 'GET',
                    headers: header
                });

                if (response.ok) {
                    const json = await response.json();
                    console.log('Despesas:', json); // Adicione esse console.log para verificar os dados recebidos
                    setData(json); // Atualiza o estado com as despesas recebidas
                } else {
                    console.log('Erro ao buscar despesas', response.status);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }
    };

    const register = async () => {
        if (userData) {
            const body = {
                userId: userData.id,
                descricao: descricao,
                valor: valor,
                mesReferencia: `2024-${mes}`
            };
            console.log(body)
            const header = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            };
            try {
                const response = await fetch('http://192.168.0.138:9002/despesa/register', {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(body)
                });
                if (response.ok) {
                    console.log("cadastrou")
                    const json = await response.json();
                    console.log(json);
                    fetchDespesas();
                } else {
                    console.log('Erro ao registrar despesa', response.status);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        } else {
            console.log('Dados do usuário ou mês ausentes');
        }
    };

    const remover = async (id) => {
        if (userData) {
            const header = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            };
            try {
                const response = await fetch(`http://192.168.0.138:9002/despesa/remove?id=${id}`, {
                    method: 'DELETE',
                    headers: header
                });
                if (response.ok) {
                    console.log("Despesa removida");
                    fetchDespesas(); // Atualiza a lista de despesas após remover uma
                } else {
                    console.log('Erro ao remover despesa', response.status);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }
    };

    // Adicione um log para verificar os dados antes de renderizar o FlatList
    console.log("Dados das despesas: ", data);

    return (
        <View style={styles.container}>
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
                            onEdit={() => console.log('editar')}
                            onDelete={() => remover(item.id)} // Corrigir a chamada onDelete
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
