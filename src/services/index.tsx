import axios from "axios"
import { UPLOAD_ASSETS_URL } from "@env"

export const UPLOAD_ASSETS = async (body: any) => {
    return axios({
        url: UPLOAD_ASSETS_URL,
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: body
    })
}