import { API, Schema } from "@pn/watch-is/driver"
import { BASE_URL } from "@env"

export const verifyOTPRequest = async (body: Schema.PostRequestVerifyOtp) => {

    const caller = API.Driver.instance().init({ base_url: BASE_URL }).driver.post["/verify-otp"]()
    return await caller(body)
}