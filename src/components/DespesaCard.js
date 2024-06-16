import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DespesaCard = ({ name, value, onEdit, onDelete }) => {
    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemText}>{name}</Text>
                <Text style={styles.itemText}>R${value.toFixed(2)}</Text>
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                    <Ionicons name="create" size={20} color={'#FFF'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                    <Ionicons name="trash" size={20} color={'#FFF'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#4caf50', 
        borderRadius: 10, 
        padding: 10, 
        marginVertical: 5,
        marginHorizontal: 10 // Adiciona margem horizontal para separar os itens da borda
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center', 
    },
    itemText: {
        color: '#fff', 
        fontSize: 16, 
        marginRight: 10,
    },
    itemActions: {
        flexDirection: 'row', 
    },
    actionButton: {
        backgroundColor: '#388E3C', // Ajusta a cor de fundo para contraste
        borderRadius: 5,
        padding: 8, 
        marginLeft: 5, 
    },
});

export default DespesaCard;
