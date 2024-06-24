import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { saveData } from '../service/data';

export default function Cadastro({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthday, setBirthday] = useState('');

    // Função para validar o formato do e-mail
    const validateEmail = (email) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    };

    // Função para validar a senha
    const validatePassword = (password) => {
        if (password.length < 6) {
            return "A senha deve ter no mínimo 6 caracteres.";
        }
        if (!/[a-zA-Z]/.test(password)) {
            return "A senha deve conter pelo menos uma letra.";
        }
        if (!/\d/.test(password)) {
            return "A senha deve conter pelo menos um número.";
        }
        return "";
    };

    const register = async () => {
        if (!name || !email || !password || !confirmPassword || !birthday) {
            Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido.");
            return;
        }

        const passwordValidationResult = validatePassword(password);
        if (passwordValidationResult !== "") {
            Alert.alert("Erro", passwordValidationResult);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        const [dia, mes, ano] = birthday.split('/');
        const birthDate = new Date(ano, mes - 1, dia);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (birthDate > currentDate) {
            Alert.alert("Erro", "A data de nascimento não pode ser no futuro.");
            return;
        }

        const date = `${ano}-${mes}-${dia}`;
        const URL = `http://192.168.0.138:9002/singup`;
        const header = {
            'Content-Type': 'application/json'
        };
        const body = {
            name,
            email,
            password,
            confirmPassword,
            birthday: date
        };
        
        const response = await fetch(URL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            saveData(jsonResponse);
            navigation.navigate("Main");
        } else {
            Alert.alert("Erro", "Falha ao registrar. Tente novamente.");
        }
    };
    return (
        <View style={styles.container}>
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
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholder="Sua confirmação de senha"
                secureTextEntry={true}
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
    );
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
});
