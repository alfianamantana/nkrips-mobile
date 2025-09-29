import { API, Schema } from "@pn/watch-is/driver"
import { PostingType, VoteType } from "@pn/watch-is/model"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const listPostingRequest = async (type = "", page = 1) => {
    const limit = 10
    const offset = (page - 1) * limit;

    let query: Schema.GetRequestQueryPosting = {
        limit: limit,
        offset: offset
    }

    if (type !== "") {
        query["type"] = type as PostingType
    }

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/posting"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        query: query
    })
}

export const listPostingByUserRequest = async (username = "", type = "", page = 1) => {
    const limit = 10
    const offset = (page - 1) * limit;

    let query: Schema.GetRequestQueryPosting = {
        limit: limit,
        offset: offset
    }

    if (type !== "") {
        query["type"] = type as PostingType
    }

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/profile/:username/posting"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            username: username
        },
        query: query
    })
}

export const getVoteRequest = async (hash = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/posting/:hash/votes"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`
        },
        path: {
            hash: hash
        }
    })
}

export const voteRequest = async (hash = "", type: VoteType) => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/posting/:hash/vote"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`,
        },
        path: {
            hash: hash
        },
        body: {
            type: type
        }
    })
}

export const listCommentRequest = async (hash = "", page = 1) => {
    const limit = 10
    const offset = (page - 1) * limit;

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.get["/posting/:hash/comments"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`,
        },
        path: {
            hash: hash
        },
        query: {
            limit: limit,
            offset: offset
        }
    })
}

export const postCommentRequest = async (hash = "", content = "") => {
    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/posting/:hash/comment"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`,
        },
        path: {
            hash: hash
        },
        body: {
            data: {
                content: content
            }
        }
    })
}

export const postingRequest = async (type: PostingType, data: any) => {
    let post: Schema.PostingPayload = {
        type: type
    }

    if (type === PostingType.PLAIN_TEXT) {
        post["data_plain_text"] = {
            text: data.text
        }
    }

    if (type === PostingType.IMAGE_STATIC) {
        post["data_image_static"] = {
            caption: data.caption,
            image_url: data.image_url
        }
    }

    if (type === PostingType.VIDEO) {
        post["data_video"] = {
            caption: data.caption,
            video_url: data.video_url
        }
    }

    if (type === PostingType.SELL_PRODUCT) {
        post["data_selling_product"] = data
    }

    const token = await AsyncStorage.getItem("token")
    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/posting"]()
    return await caller({
        header: {
            authorization: `Bearer ${token}`,
        },
        body: {
            data: post
        }
    })
}