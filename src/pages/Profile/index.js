import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

function ProfileScreen() {
  // Função para lidar com o clique no botão de sair
  const handleLogout = () => {
    Alert.alert("Sair", "Você foi desconectado.");
    // Aqui você pode adicionar a lógica para deslogar o usuário e redirecionar para a tela de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Dados</Text>
      <Text style={styles.label}>Nome</Text>
      <Text style={styles.value}>João</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>joao@gmail.com</Text>
      <Text style={styles.label}>Data de nascimento</Text>
      <Text style={styles.value}>09/12/1987</Text>
      <View style={styles.buttonContainer}>
        <Button title="SAIR" color="#4CAF50" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#777',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 32,
    width: '80%',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
});

export default ProfileScreen;