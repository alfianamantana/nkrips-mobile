import axios from "axios"
import moment from "moment-timezone";


function generateFileName(fileType: string) {
    let ext = "dat";
    if (fileType.includes("image/")) ext = fileType.split("/")[1];
    else if (fileType.includes("video/")) ext = fileType.split("/")[1];
    else if (fileType === "application/pdf") ext = "pdf";

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
            "Content-Type": "multipart/form-data", // JANGAN set ini, biarkan axios/FormData yang set boundary-nya
        }
    })
}