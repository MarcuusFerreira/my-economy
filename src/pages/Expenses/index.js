import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Progress from 'react-native-progress';

const ExpensesScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Janeiro', value: 'janeiro' },
    { label: 'Fevereiro', value: 'fevereiro' },
  ]);
  const [progressValue, setProgressValue] = useState(1100);
  const totalValue = 1500;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá João 👋</Text>
      <Text style={styles.subGreeting}>É bom te ver por aqui</Text>
      <DropDownPicker
        open={open}
        value={selectedMonth}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedMonth}
        setItems={setItems}
        placeholder="Selecione um mês"
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>😊Continue assim!</Text>
      </TouchableOpacity>
      <Text style={styles.progressText}>Progresso R${progressValue}/R${totalValue}</Text>
      <Progress.Bar progress={progressValue / totalValue} width={200} color="green" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownContainer: {
    width: '80%',
    marginBottom: 20,
  },
  dropdown: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
});

export default ExpensesScreen;
