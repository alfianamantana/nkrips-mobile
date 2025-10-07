import { API, Schema } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const listContactRequest = async (search = "", page = 1) => {
    const limit = 1000
    const offset = (page - 1) * limit;
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/my-friends"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        query: {
            limit: limit,
            offset: offset
        }
    })
}

export const listGroupRequest = async (search = "", page = 1) => {
    const limit = 1000
    const offset = (page - 1) * limit;
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/my-community"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        query: {
            limit: limit,
            offset: offset
        }
    })
}

export const listContactSearchRequest = async (search = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/search"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        query: {
            q: search
        }
    })
}

export const listContactPhoneNumberSearchRequest = async (search = "") => {

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/search/by-phone-number"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        query: {
            phone_number: `+62${search}`
        }
    })
}

export const listContactIdUserSearchRequest = async (search = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/search/by-id-user"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        query: {
            username: search
        }
    })
}