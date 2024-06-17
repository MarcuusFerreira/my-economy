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
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('userData');
            if (userJson !== null) {
                setUserData(JSON.parse(userJson));
            }
        } catch (error) {
            console.log("Erro ao carregar dados: ", error);
        } finally {
            setIsLoading(false); // Dados carregados, seja com sucesso ou erro
        }
    };

    const fetchData = async () => {
        if (!userData) {
            console.log("User data is not loaded yet");
            return;
        }
        try {
            const response = await fetch(`http://192.168.0.138:9002/limite/get?userId=${userData.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            if (response.ok) {
                const json = await response.json();
                setData(json);
            } else {
                console.log("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const register = async () => {
        if (!userData) {
            console.log("User data is not loaded yet");
            return;
        }
        const URL = 'http://192.168.0.138:9002/limite/register';
        const body = JSON.stringify({
            limite: valor,
            mesReferencia: mes,
            userId: userData.id
        });
        console.log(body);
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: body
            });
            if (response.ok) {
                setValor('')
                setMes(null)
                fetchData();
            } else {
                console.log("Failed to save data");
            }
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const remover = async (id) => {
        if (!userData) {
            console.log("User data is not loaded yet");
            return;
        }
        try {
            const response = await fetch(`http://192.168.0.138:9002/limite/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            if (response.ok) {
                console.log("Removed");
                fetchData();
            } else {
                console.log("Failed to remove data");
            }
        } catch (error) {
            console.error("Error removing data:", error);
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
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <>
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
                    <TouchableOpacity style={styles.btn} onPress={register} disabled={!userData}>
                        <Text style={styles.btnText}>Salvar</Text>
                    </TouchableOpacity>
                    <View style={styles.consulta}>
                        <Text style={styles.conText}>Consulta</Text>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <MonthCard
                                    id={item.id}
                                    mesAno={item.mesReferencia}
                                    valor={item.limite}
                                    onEdit={() => console.log('editar')}
                                    onDelete={(item) => remover(item.id)}
                                />
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                </>
            )}
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
