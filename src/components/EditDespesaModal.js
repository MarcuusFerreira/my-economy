// src/components/EditLimitModal.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { TextInputMask } from 'react-native-masked-text';
import DropDownPicker from 'react-native-dropdown-picker';

const EditDespesaModal = ({ 
    isVisible, 
    onClose, 
    onSave, 
    descricao,
    setDescricao,
    valor, 
    setValor, 
    mes, 
    setMes, 
    items,
    setItems
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Editar Limite</Text>
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
                    containerStyle={styles.dropdownContainer}
                />
                <TouchableOpacity style={styles.btn} onPress={onSave}>
                    <Text style={styles.btnText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
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
        marginBottom: 10,
    },
    btnText: {
        color: '#FFF',
    },
    cancelBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#f44336',
        width: '100%',
        height: 40,
    }
});

export default EditDespesaModal;
