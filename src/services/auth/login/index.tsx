import { API, Schema } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"

export const loginRequest = async (nomorHP = "") => {
    console.log(nomorHP, "nomorHP");
    console.log(BASE_URL, 'BASE_URL');

    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/login"]()
    return await caller({
        body: {
            data: {
                nomor_hp: nomorHP
            }
        }
    })
}