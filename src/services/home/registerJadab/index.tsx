import { BASE_URL } from "@env";
import { API, Schema } from "@pn/watch-is/driver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getRegisterJadabRequest = async () => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/daftar-jadab"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        }
    })
}

export const postRegisterTahap1Request = async (bodyData: Schema.FormPendaftaranJadab1) => {
    const token = await AsyncStorage.getItem("token")

    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/daftar-jadab/1"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            data: bodyData
        }
    })
}

export const postRegisterTahap2Request = async (bodyData: Schema.FormPendaftaranJadab2) => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/daftar-jadab/2"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            data: bodyData
        }
    })
}

export const postRegisterTahap3Request = async (bodyData: Schema.FormPendaftaranJadab3) => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/daftar-jadab/3"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            data: bodyData
        }
    })
}

export const postDaftarUsaha = async (bodyData: Schema.FormPendaftaranJadab1) => {
    const token = await AsyncStorage.getItem("token")

    return await api({
        method: "POST",
        url: "/jadab/daftar-usaha",
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            data: bodyData
        }
    })
};

export async function getPengajuanSaya() {
    const token = await AsyncStorage.getItem("token")
    console.log(token, 'token');


    return api({
        method: "GET",
        url: "/jadab/daftar-usaha",
        headers: {
            authorization: `Bearer ${token}`
        },
        params: {
            page: "Pengajuan saya",
        },
    });
}

export async function getUsahaSaya() {
    const token = await AsyncStorage.getItem("token");
    return api({
        method: "GET",
        url: "/jadab/daftar-usaha",
        headers: {
            authorization: `Bearer ${token}`
        },
        params: {
            page: "Usaha saya",
        },
    });
}

export async function getBagiHasilUsaha(id: number) {
    const token = await AsyncStorage.getItem("token");
    return api({
        method: "GET",
        url: `/jadab/bagi-hasil/${id}`,
        headers: {
            authorization: `Bearer ${token}`
        },
    });
}

export async function postBayarBagiHasil(body: {
    jatuh_tempo_id: number;
    jumlah_pembayaran: number;
    bukti_pembayaran_url: string;
}) {
    const token = await AsyncStorage.getItem("token");
    return api({
        method: "POST",
        url: "/jadab/bayar-bagi-hasil",
        headers: {
            authorization: `Bearer ${token}`,
        },
        data: body,
    });
}

export async function getDetailBayarBagiHasil(jatuh_tempo_id: number) {
    const token = await AsyncStorage.getItem("token");
    return api({
        method: "GET",
        url: `/jadab/bagi-hasil/pay/${jatuh_tempo_id}`,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
}

export async function approveOffer(id: number) {
    const token = await AsyncStorage.getItem("token");
    return api({
        method: "POST",
        url: `/jadab/offer/approve/${id}`,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
}

export async function rejectOffer(id: number) {
    const token = await AsyncStorage.getItem("token");
    return api({
        method: "POST",
        url: `/jadab/offer/reject/${id}`,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
}