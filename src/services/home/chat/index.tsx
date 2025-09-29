import { API } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AttachmentType } from "@pn/watch-is/model"
import axios from 'axios'

export const listMessageRequest = async (page = 1) => {
    const limit = 10
    const offset = (page - 1) * limit;
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/latest-messages"]()
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

export const listComunityRequest = async () => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/my-community"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        query: {
            limit: 10,
            offset: 0
        }
    })
}

export const createComunityRequest = async (thumnail = "", name = "", members_public_id = []) => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/community"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        body: {
            data: {
                thumbnail: thumnail,
                name: name,
                members_public_id: members_public_id
            }
        }
    })
}

export const listDetailChatRequest = async (public_hash = "", limit = 10, page = 1) => {
    const offset = (page - 1) * limit;
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/message/:public_hash"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_hash: public_hash
        },
        query: {
            limit: limit,
            offset: offset
        }
    })
}

export const listDetailGroupRequest = async (public_hash = "", limit = 10, page = 1) => {
    const offset = (page - 1) * limit;
    const token = await AsyncStorage.getItem("token")

    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/community/message/:public_id"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_id: public_hash
        },
        query: {
            limit: limit,
            offset: offset
        }
    })
}

export const postChatGroupRequest = async (
    public_hash = "",
    message = "",
    type: AttachmentType | null = null,
    filename = "",
    id_reply_message?: number
) => {
    type postType = {
        message: string,
        attachment?: {
            type: AttachmentType,
            filename: string
        }
    }

    let postMessage: postType = {
        message: message
    }

    if (type !== null) {
        postMessage["attachment"] = {
            type: type,
            filename: filename
        }
    }

    if (id_reply_message) {
        postMessage.id_reply_message = id_reply_message
    }

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/community/message/:public_id/send"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_id: public_hash
        },
        body: {
            data: postMessage
        }
    })
}

export const postChatRequest = async (
    public_hash = "",
    message = "",
    type: AttachmentType | null = null,
    filename = "",
    id_reply_message?: number
) => {
    type postType = {
        message: string,
        attachment?: {
            type: AttachmentType,
            filename: string
        }
        id_reply_message?: number
    }

    let postMessage: postType = {
        message: message
    }

    if (type !== null) {
        postMessage["attachment"] = {
            type: type,
            filename: filename
        }
    }

    if (id_reply_message) {
        postMessage.id_reply_message = id_reply_message
    }

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/message/:public_hash/send"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            public_hash: public_hash
        },
        body: {
            data: postMessage
        }
    })
}

export const postPinMessageRequest = async (
    public_hash: string,
    message_id: number,
    pinned_duration: number
) => {
    const token = await AsyncStorage.getItem("token");

    const caller = axios({
        method: 'post',
        url: `${BASE_URL}/message/${public_hash}/pinned`,
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            message_id,
            pinned_duration
        }
    })
    return caller;
};

export const deleteMessageRequest = async (public_hash: string, message_id: number) => {
    const token = await AsyncStorage.getItem("token");
    const caller = axios({
        method: 'post',
        url: `${BASE_URL}/message/${public_hash}/delete`,
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            message_id
        }
    })

    return caller;
};

export const editMessageRequest = async (public_hash: string, message_id: number, message: string) => {
    const token = await AsyncStorage.getItem("token");
    const caller = axios({
        method: 'post',
        url: `${BASE_URL}/message/${public_hash}/edit`,
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            message_id,
            message
        }
    });
    return caller;
};