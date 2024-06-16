import AsyncStorage from '@react-native-async-storage/async-storage'; 

const disparaRequest = async (method, path, body) => {
    const [userData, setUserData] = useState(null); 
    const loadData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('userData');
            if (userJson !== null) {
                setUserData(JSON.parse(userJson));
            }
        } catch (error) {
            console.log("Erro ao carregar dados: ", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    console.log(userData.token)
    const URL = `http://192.168.0.138:9002/${path}`
    const response = await fetch(URL, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        },
        body: body
    })
    if (response.ok) {
        return response.json()
    }
}

export { disparaRequest }