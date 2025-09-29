import AsyncStorage from "@react-native-async-storage/async-storage"

export const Logout = async (error:any, navigation:any) => {
    if(error.response.status === 401 || error.response.status === 500) {
        await AsyncStorage.clear()
        await navigation.navigate("Login")
    }
}