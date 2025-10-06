import { API, Schema } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const registerRequest = async (nomorHP = "") => {
    console.log(BASE_URL, 'BASE_URLBASE_URL');

    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/register"]()
    return await caller({
        body: {
            data: {
                nomor_hp: nomorHP
            }
        }
    })
}

export const createUsernameRequest = async (username = "", profile_picture_url = "") => {
    let postData: any = {
        username: username
    }

    if (profile_picture_url !== "") {
        postData["profile_picture_url"] = profile_picture_url
    }

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/onboarding/photo-username"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            data: postData
        }
    })
}

export const dataDiriRequest = async (fullname = "", email = "", tanggalLahir = "", domisili = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/onboarding/data-diri"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            data: {
                fullname: fullname,
                email: email,
                tanggal_lahir: tanggalLahir,
                domisili: domisili
            }
        }
    })
}

export const acceptSNKRequest = async () => {
    const token = await AsyncStorage.getItem("token")
    console.log(token, 'token');

    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/onboarding/accept-snk"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        }
    })
}