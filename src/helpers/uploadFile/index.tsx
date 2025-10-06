import axios from "axios"
import moment from "moment-timezone";
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

function generateFileName(fileType: string | undefined) {
    let ext = "dat";
    if (typeof fileType === "string") {
        if (fileType.includes("image/")) ext = fileType.split("/")[1];
        else if (fileType.includes("video/")) ext = fileType.split("/")[1];
        else if (fileType === "application/pdf") ext = "pdf";
    }
    return moment().format("YYYYMMDD_HHmmss") + "." + ext;
}

export const uploadFile = async (fileUri: string, fileType: string) => {
    const formData = new FormData();
    formData.append("file", {
        uri: fileUri,
        name: generateFileName(fileType),
        type: fileType,
    });

    return await axios({
        url: "https://awan.graf.run/upload",
        method: "POST",
        data: formData,
        headers: {
            "Authorization": "hseo",
            "Content-Type": "multipart/form-data",
        }
    })
}

export const uploadFile2 = async (path: string, data: any) => {
    const Token = await AsyncStorage.getItem("token")
    return await axios({
        url: BASE_URL + path,
        method: "POST",
        data: data,
        headers: {
            "Authorization": `Bearer ${Token}`,
            "Content-Type": "multipart/form-data"
        },
        timeout: 60000
    })
}