import { API, Schema } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "../../api"

export const myProfileRequest = async (nomorHP = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/profile"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        }
    })
}

export const myGroupRequest = async (public_id = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/community/by-public-id/:public_id"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_id: public_id
        }
    })
}

export const profileContactRequest = async (username = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/profile/:username"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            username: username
        }
    })
}

export const addFriendRequest = async (public_id = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/user/:public_id/add-friend"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_id: public_id
        }
    })
}

export const addMoreMemberGroupRequest = async (public_id = "", list_member_public_hash = []) => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/community/by-public-id/:public_id/member"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`,

        },
        path: {
            public_id: public_id
        },
        body: {
            list_member_public_hash: list_member_public_hash
        }
    })
}

export const leaveGroupRequest = async (public_id = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/community/by-public-id/:public_id/leave"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_id: public_id
        }
    })
}

export const addToAdminGroupRequest = async (public_id = "", public_hash = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/community/by-public-id/:public_id/member/:public_hash/set-admin"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_id: public_id,
            public_hash: public_hash
        }
    })
}

export const removeFromAdminGroupRequest = async (public_id = "", public_hash = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.delete["/community/by-public-id/:public_id/member/:public_hash/delete-admin"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_id: public_id,
            public_hash: public_hash
        }
    })
}

type payloadUpdateProfile = {
    'profile_picture_url'?: string;
    'fullname': string;
    'email': string;
    'tanggal_lahir': string;
    'domisili'?: string;
}

export const editProfileRequest = async (bodyUpdateProfile: payloadUpdateProfile) => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/profile/update"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            data: bodyUpdateProfile
        }
    })
}

export const memberCommunity = async (public_id: string) => {
    return api({
        method: 'get',
        url: `/community/by-public-id/${public_id}/member`,
    })
}