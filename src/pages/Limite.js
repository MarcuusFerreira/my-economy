import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text';
import MonthCard from '../components/MonthCard';
import EditLimitModal from '../components/EditLimitModal';
import { useFocusEffect } from '@react-navigation/native';  // Importando o useFocusEffect

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
        { label: 'Janeiro/2025', value: '2025-01' },
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editValor, setEditValor] = useState('');
    const [editMes, setEditMes] = useState(null);
    const [openFiltro, setOpenFiltro] = useState(false);
    const [mesFiltro, setMesFiltro] = useState(null);
    const [itemsFiltro, setItemsFiltro] = useState([]);
    const [isFiltroLoading, setIsFiltroLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userJson = await AsyncStorage.getItem('userData');
                if (userJson) {
                    setUserData(JSON.parse(userJson));
                }
            } catch (error) {
                Alert.alert("Erro", "Erro ao carregar dados do usuário.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (userData) {
                fetchData();
                fetchFiltroData();
            }
        }, [userData])
    );

    useEffect(() => {
        // Fetch data when mesFiltro changes
        if (mesFiltro) {
            const fetchCardLimites = async () => {
                try {
                    const response = await fetch(`http://192.168.0.138:9002/limite/get-limite?userId=${userData.id}&mesReferencia=${mesFiltro}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userData.token}`
                        }
                    });
                    if (response.ok) {
                        const jsonResponse = await response.json();
                        setData([])
                        setData(jsonResponse);
                    } else {
                        throw new Error("Erro ao buscar limites para o mês selecionado.");
                    }
                } catch (error) {
                    Alert.alert("Erro de requsição", error.message);
                } finally {
                    setIsFiltroLoading(false);
                }
            };
            fetchCardLimites();
        }
    }, [mesFiltro, userData]);

    const fetchData = async () => {
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
                throw new Error("Falha ao buscar dados.");
            }
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };

    const fetchFiltroData = async () => {
        setIsFiltroLoading(true);
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
                setItemsFiltro(formattedData);
            } else {
                throw new Error("Falha ao buscar dados do filtro.");
            }
        } catch (error) {
            Alert.alert("Erro", error.message);
        } finally {
            setIsFiltroLoading(false);
        }
    };

    const register = async () => {
        if (!userData || !mes) {
            Alert.alert("Erro", "É necessário selecionar um mês e estar logado.");
            return;
        }
        const existingLimit = data.find(item => item.mesReferencia === mes);
        if (existingLimit) {
            Alert.alert("Erro", "Já existe um limite cadastrado para este mês.");
            return;
        }
        try {
            const body = JSON.stringify({
                limite: parseFloat(valor.replace(/[R$ ,.]/g, '')) / 100,
                mesReferencia: mes,
                userId: userData.id
            });
            const response = await fetch(`http://192.168.0.138:9002/limite/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: body
            });
            if (response.ok) {
                setValor('');
                setMes(null);
                fetchData();
            } else {
                const jsonResponse = await response.json();
                Alert.alert("Erro", jsonResponse.message);
                throw new Error(jsonResponse.message);
            }
        } catch (error) {
            Alert.alert("Erro de Registro", error.message);
        }
    };

    const remover = async (id) => {
        try {
            const response = await fetch(`http://192.168.0.138:9002/limite/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            if (response.ok) {
                fetchData();
                Alert.alert("Concluido", "Limite excluido com sucesso!");
            } else {
                const jsonResponse = await response.json();
                Alert.alert("Erro", jsonResponse.message);
                throw new Error(jsonResponse.message);
            }
        } catch (error) {
            Alert.alert("Erro de Remoção", error.message);
        }
    };

    const abrirModalEdicao = (item) => {
        setEditId(item.id);
        setEditValor(item.limite.toString());
        setEditMes(item.mesReferencia);
        setIsModalVisible(true);
    };

    const saveEdit = async () => {
        try {
            const body = JSON.stringify({
                limite: parseFloat(editValor.replace(/[R$ ,.]/g, '')) / 100,
                mesReferencia: editMes,
                id: editId
            });
            const response = await fetch(`http://192.168.0.138:9002/limite/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: body
            });
            if (response.ok) {
                fetchData();
                setIsModalVisible(false);
                const jsonResponse = await response.json();
                Alert.alert("Concluido", jsonResponse.message);
            } else {
                const jsonResponse = await response.json();
                Alert.alert("Erro", jsonResponse.message);
            }
        } catch (error) {
            Alert.alert("Erro de Atualização", error.message);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? <Text>Loading...</Text> : (
                <>
                    <Text style={styles.title}>Limite</Text>
                    <TextInputMask
                        type="money"
                        options={{
                            precision: 2,
                            separator: '.',
                            delimiter: ',',
                            unit: 'R$ ',
                            suffixUnit: ''
                        }}
                        style={styles.input}
                        value={valor}
                        onChangeText={setValor}
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
                    <TouchableOpacity style={styles.btn} onPress={register} disabled={!userData || !mes}>
                        <Text style={styles.btnText}>Salvar</Text>
                    </TouchableOpacity>
                    <View style={styles.consulta}>
                        <Text style={styles.conText}>Consulta</Text>
                        <DropDownPicker
                            open={openFiltro}
                            value={mesFiltro}
                            items={itemsFiltro}
                            setOpen={setOpenFiltro}
                            setValue={setMesFiltro}
                            setItems={setItemsFiltro}
                            placeholder='Selecione o mês'
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            disabled={isFiltroLoading}
                        />
                        {isFiltroLoading ? <Text>Carregando...</Text> : null}
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <MonthCard
                                    id={item.id}
                                    mesAno={item.mesReferencia}
                                    valor={item.limite}
                                    onEdit={() => abrirModalEdicao(item)}
                                    onDelete={() => remover(item.id)}
                                />
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                    <EditLimitModal
                        isVisible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        onSave={saveEdit}
                        valor={editValor}
                        setValor={setEditValor}
                        mes={editMes}
                        setMes={setEditMes}
                        items={items}
                        setItems={setItems}
                    />
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
        paddingTop: 50,
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
