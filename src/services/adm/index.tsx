import { API } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const provinsiRequest = async () => {
    const token  = await AsyncStorage.getItem("token") 
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/adm/provinsi"]()
    return await caller({
        header : {
            authorization : `Bearer ${token}`
        }
    })
}

export const kabRequest = async (id_provinsi:number) => {
    const token  = await AsyncStorage.getItem("token") 
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/adm/provinsi/:id_provinsi/kota-kab"]()
    return await caller({
        header : {
            authorization : `Bearer ${token}`
        },
        path : {
            id_provinsi : id_provinsi
        }
    })
}

export const kecRequest = async (id_provinsi:number, id_kota_kab:number) => {
    const token  = await AsyncStorage.getItem("token") 
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/adm/provinsi/:id_provinsi/kota-kab/:id_kota_kab/kecamatan"]()
    return await caller({
        header : {
            authorization : `Bearer ${token}`
        },
        path : {
            id_provinsi : id_provinsi,
            id_kota_kab : id_kota_kab
        }
    })
}

export const kelRequest = async (id_provinsi:number, id_kota_kab:number, id_kecamatan:number) => {
    const token  = await AsyncStorage.getItem("token") 
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/adm/provinsi/:id_provinsi/kota-kab/:id_kota_kab/kecamatan/:id_kecamatan"]()
    return await caller({
        header : {
            authorization : `Bearer ${token}`
        },
        path : {
            id_provinsi  : id_provinsi,
            id_kota_kab  : id_kota_kab,
            id_kecamatan : id_kecamatan
        }
    })
}