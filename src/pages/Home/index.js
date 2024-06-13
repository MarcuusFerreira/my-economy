import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Progress from 'react-native-progress';

const HomeScreen = () => {
  const [mes, setMes] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Janeiro', value: 'janeiro' },
    { label: 'Fevereiro', value: 'fevereiro' },
    // Adicione mais meses conforme necessário
  ]);
  const [valor, setValor] = useState(1100);
  const total = 1500;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Olá João 👋</Text>
      <Text style={styles.subheader}>É bom te ver por aqui</Text>
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue assim!</Text>
      </TouchableOpacity>
      <Text style={styles.progressText}>Progresso R${valor}/R${total}</Text>
      <Progress.Bar progress={valor / total} width={200} color="green" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  dropdown: {
    height: 40,
    width: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  progressText: {
    marginBottom: 10,
  }
});

export default HomeScreen;
