// MonthCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MonthCard = ({id, mesAno, valor, onEdit, onDelete}) => {
    const remove = () => {
        console.log(id)
    }
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.monthText}>{mesAno}</Text>
        <Text style={styles.amountText}>R${valor}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onEdit}>
          <Text style={styles.buttonText}>EDITAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onDelete}>
          <Text style={styles.buttonText}>EXCLUIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  monthText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  amountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MonthCard;
