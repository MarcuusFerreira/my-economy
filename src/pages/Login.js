import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const entrar = async () => {
        console.log(email)
        console.log(password)
        const URL = 'http://192.168.0.186:9002/singin'
        const header = {
            'Content-Type': 'application/json'
        }
        const body = {
            email: email,
            password: password
        }
        console.log(body)
        const response = await fetch(URL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        })
        console.log(response.status)
        if (response.ok) {
            const jsonResponse = await response.json()
            console.log('Resposta do servidor: ', jsonResponse)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrar</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="e-mail"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Sua senha"
                secureTextEntry
            />
            <TouchableOpacity style={styles.buttonSingin} onPress={entrar}>
                <Text style={styles.buttonTextSingin}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSingup} onPress={() => navigation.navigate("Cadastro")}>
                <Text>Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 24
    },
    input: {
      width: '80%',
      height: 40,
      borderRadius: 8,
      borderColor: '#000',
      borderWidth: 1,
      paddingHorizontal: 8,
      marginBottom: 16,
    },
    buttonSingin: {
      width: '80%',
      height: 40,
      backgroundColor: '#4CAF50',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonTextSingin: {
      color: '#fff',
      fontWeight: 'bold',
    },
    buttonSingup: {
      width: '80%',
      height: 40,
      borderRadius: 8,
      borderColor: '#000',
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    linkText: {
      color: '#000',
      textDecorationLine: 'underline',
    }
  });
  