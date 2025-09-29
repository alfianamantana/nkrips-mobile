import { API } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const cloudMessagingRequest = async (fcmToken: string) => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/fcm-token"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            token: fcmToken
        }
    })
}