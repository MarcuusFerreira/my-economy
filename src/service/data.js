import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveData(data) {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
}

export { saveData }