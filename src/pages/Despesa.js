import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DespesaCard from '../components/DespesaCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import EditDespesaModal from '../components/EditDespesaModal'

export default function Despesa() {
const [userData, setUserData] = useState(null);
const [descricao, setDescricao] = useState('');
const [valor, setValor] = useState('');
const [mes, setMes] = useState(null);
const [open, setOpen] = useState(false);
const [items, setItems] = useState([]);
const [data, setData] = useState([]);
const [isModalVisible, setIsModalVisible] = useState(false);
const [editId, setEditId] = useState(null);
const [editDescricao, setEditDescricao] = useState(null)
const [editValor, setEditValor] = useState('');
const [editMes, setEditMes] = useState(null);
const [openFiltro, setOpenFiltro] = useState(false)
const [mesFiltro, setMesFiltro] = useState(null)
const [itemsFiltro, setItemsFiltro] = useState([])

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
        fetchMesDropData();
        fetchFiltroData();
    }
}, [userData]);

useEffect(() => {
    if(mesFiltro) {
        const fetchCardDespesas = async () => {
            try {
                const response = await fetch(`http://192.168.0.138:9002/despesa/get-despesa?userId=${userData.id}&mesReferencia=${mesFiltro}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    }
                })
                if(response.ok) {
                    const jsonResponse = await response.json()
                    setData([])
                    setData(jsonResponse)
                }
            } catch (error) {
                Alert.alert('Erro', 'Erro ao buscar os filtros')
            }
        }
        fetchCardDespesas()
    }
}, [mesFiltro, userData])

const fetchDespesas = async () => {
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
            setData(json);
        } else {
            console.log('Erro ao buscar despesas', response.status);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
};

const fetchMesDropData = async () => {
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
};

const fetchFiltroData = async () => {
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
        valor: parseFloat(valor.replace(/[R$ ,.]/g, '')) / 100,
        mesReferencia: mes
    };
    const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
    };
    try {
        const response = await fetch(`http://192.168.0.138:9002/despesa/register`, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        });
        if (response.ok) {
            setDescricao('');
            setMes(null);
            setValor('');
            Alert.alert("Concluido", "Despesa cadastrada com sucesso!")
            fetchDespesas()
        } else {
            const jsonResponse = await response.json()
            Alert.alert("Erro", jsonResponse.message)
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

const abrirModalEdicao = async (item) => {
    setEditId(item.id)
    setEditDescricao(item.descricao)
    setEditValor(item.valor.toString())
    setEditMes(item.mesReferencia)
    setIsModalVisible(true)
}

const saveEdit = async () => {
    try {
        const body = JSON.stringify({
            id: editId,
            userId: userData.id,
            descricao: editDescricao,
            valor: parseFloat(editValor.replace(/[R$ ,.]/g, '')) / 100,
            mesReferencia: editMes
        })
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }
        console.log(body)
        const response = await fetch('http://192.168.0.138:9002/despesa/update', {
            method: 'PUT',
            headers: header,
            body: body
        })
        const jsonResponse = await response.json()
        if(response.ok) {
            fetchDespesas()
            setIsModalVisible(false)
            Alert.alert("Concluido", jsonResponse.message)
        } else {
            Alert.alert("Erro ao atualizar", jsonResponse.message)
        }
    } catch(error) {
        Alert.alert("Erro de atualizar despesa", error.message)
    }
}

const confirmDelete = async (id) => {
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
        <>
        <Text style={styles.title}>Despesa</Text>
        <TextInput
            style={styles.input}
            onChangeText={setDescricao}
            value={descricao}
            placeholder="Descrição"
            keyboardType="default"
        />
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
        />
        <TouchableOpacity style={styles.btn} onPress={register}>
            <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
        <View style={styles.hist}>
            <Text style={styles.histTitle}>Histórico</Text>
            <DropDownPicker
                open={openFiltro}
                value={mesFiltro}
                items={itemsFiltro}
                setOpen={setOpenFiltro}
                setValue={setMesFiltro}
                setItems={setItemsFiltro}
                placeholder="Selecione um mês"
                style={styles.dropdown}
            />
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <DespesaCard
                        name={item.descricao}
                        value={item.valor}
                        onEdit={() => abrirModalEdicao(item)}
                        onDelete={() => remover(item.id)}
                    />
                )}
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
        <EditDespesaModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSave={saveEdit}
            descricao={editDescricao}
            setDescricao={setEditDescricao}
            valor={editValor}
            setValor={setEditValor}
            mes={editMes}
            setMes={setEditMes}
            items={items}
            setItems={setItems}
        />
        </>
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
