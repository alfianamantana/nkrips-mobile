import axios from "axios";
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token")
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export { api }