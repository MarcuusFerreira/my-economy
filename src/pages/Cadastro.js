import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default function Cadastro({ navigation }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [birthday, setBirthday] = useState('')
    const register = async () => {
        if (password == confirmPassword) {
            const [dia, mes, ano] = birthday.split('/')
            const date = `${ano}-${mes}-${dia}`
            const URL = 'http://192.168.0.186:9002/singup'
            const header = {
                'Content-Type': 'application/json'
            }
            const body = {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                birthday: date
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
                console.log(jsonResponse)
            }
        }
    }

    return (<View style={styles.container}>
        <Text style={styles.title}>Cadastre-se</Text>
        <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Seu nome"
            keyboardType="text"
        />
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
        <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Sua confirmação de senha"
            secureTextEntry
        />
        <TextInputMask
            type={'datetime'}
            options={{
                format: 'DD/MM/YYYY',
              }}
            style={styles.input}
            onChangeText={setBirthday}
            value={birthday}
            placeholder="Data de Nascimento (DD/MM/YYYY)"
            keyboardType="numeric"
        />
        <TouchableOpacity style={styles.buttonSingup} onPress={register}>
            <Text style={styles.buttonTextSingup}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSingin} onPress={() => navigation.navigate("Login")}>
            <Text>Entrar</Text>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
    buttonSingup: {
        width: '80%',
        height: 40,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginBottom: 16,
      },
      buttonTextSingup: {
        color: '#fff',
        fontWeight: 'bold',
      },
      buttonSingin: {
        width: '80%',
        height: 40,
        borderRadius: 8,
        borderColor: '#000',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
})
