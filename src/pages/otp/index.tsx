import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import OTPTextInput from "react-native-otp-textinput"
import moment from "moment-timezone"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Assets from "../../assets"
import { FC, useState, useRef, useEffect } from "react"
import { verifyOTPRequest } from "../../services/auth/verifyOTP"
import { loginRequest } from "../../services/auth/login"
import { registerRequest } from "../../services/auth/register"
import { typeOTP } from "../../enums"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../../tailwind.config"
import messaging from '@react-native-firebase/messaging';
import { cloudMessagingRequest } from "../../services/auth/cloudMessaging"

const { theme } = resolveConfig(tailwindConfig)

interface InputOTPInterface {
    navigation: any
    route?: any
}

const InputOTP: FC<InputOTPInterface> = ({ navigation, route }) => {
    let timeout: any = ""
    const [valueOTP, setValueOTP] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [isRequestAgain, setIsRequestAgain] = useState(false)
    const [currentHash, setCurrentHash] = useState("")
    const { TypePage, hash, phoneNumber } = route.params
    const [loadingVerify, setLoadingVerify] = useState(false)
    const [timeNow, setTimeNow] = useState("1:00")

    const verifyOTP = async () => {
        setLoadingVerify(true)
        try {
            const checkOTP = await verifyOTPRequest({
                body: {
                    data: {
                        hash: isRequestAgain ? currentHash : hash,
                        type: TypePage as any,
                        code: valueOTP
                    }
                }
            })

            console.log(checkOTP, 'checkOTPcheckOTP');


            await AsyncStorage.setItem("token", checkOTP.token)
            await AsyncStorage.setItem("user", JSON.stringify(checkOTP.user))

            const tokenFCM = await messaging().getToken()
            await cloudMessagingRequest(tokenFCM)

            if (TypePage === typeOTP.LOGIN) {
                navigation.navigate("ListChat")
            } else {
                navigation.navigate("CreateUsername")
            }

        } catch (error: any) {
            console.log(error, 'errorerror');

            setErrorMsg(error.response.data)

        } finally {
            setLoadingVerify(false)
        }
    }

    const requestOTP = async () => {
        setIsRequestAgain(true)
        if (TypePage === typeOTP.LOGIN) {
            const requestAgainOTPlogin = await loginRequest(phoneNumber)
            setCurrentHash(requestAgainOTPlogin.hash)

            await AsyncStorage.setItem("totalCountDown", "60")
            countDown()

        } else {
            const requestAgainOTPregister = await registerRequest(phoneNumber)
            setCurrentHash(requestAgainOTPregister.hash)

            await AsyncStorage.setItem("totalCountDown", "60")
            countDown()
        }
    }

    const countDown = async () => {
        const totalCountDown = await AsyncStorage.getItem("totalCountDown")
        timeout = setTimeout(async () => {
            if (parseInt(totalCountDown as string) > 0) {
                const minsOne = parseInt(totalCountDown as string) - 1
                await AsyncStorage.setItem("totalCountDown", minsOne.toString())

                setTimeNow(moment.utc(minsOne * 1000).format("mm:ss"))
                countDown()

            } else {
                clearTimeout(timeout)
            }
        }, 1000)
    }

    useEffect(() => {
        countDown()

        if (valueOTP.length === 6) {
            verifyOTP()
        }

        return () => {
            clearTimeout(timeout)
        }

    }, [valueOTP])

    return (
        <View className="flex-1 p-4 bg-white">
            <View className="justify-center items-center">
                <Assets.ImageOtp width={150} height={150} />
            </View>
            <View className="my-4">
                <View className="pt-3 pb-5">
                    <OTPTextInput
                        inputCount={6}
                        tintColor="#404040"
                        offTintColor="#E0E0E0"
                        handleTextChange={(e) => setValueOTP(e)}
                        autoFocus={true}
                    />
                </View>
                <View>
                    {
                        loadingVerify ?
                            <View className="items-center justify-center flex-row py-3">
                                <View>
                                    <ActivityIndicator color={theme?.colors!["Primary/Main"] as string} size="small" />
                                </View>
                                <View className="px-2">
                                    <Text className="font-normal text-xs font-satoshi text-Primary/Main">Loading Verifikasi OTP ...</Text>
                                </View>
                            </View>
                            :
                            errorMsg !== "" &&
                            <View className="items-center pb-4">
                                <Text className="font-medium font-satoshi text-Primary/Main">{errorMsg}</Text>
                            </View>
                    }

                    <View className="justify-center items-center">
                        <Text className="text-center font-satoshi text-gray-500">
                            Masukkan 6 digit angka yang telah kami kirimkan ke nomor telepon

                            &nbsp;

                            <Text className="font-satoshi font-medium text-black">
                                +62{phoneNumber}
                            </Text>
                        </Text>
                    </View>
                    <View className="my-2 items-center">
                        <View>
                            <Text className="font-satoshi text-gray-500">Tidak menerima kode?</Text>
                        </View>
                        <View className="py-3 justify-center items-center">

                            {
                                timeNow === "00:00" ?
                                    <TouchableOpacity onPress={() => requestOTP()}>
                                        <View>
                                            <Text className="font-bold font-satoshi text-Primary/Main text-md">Kirim Ulang</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <Text className="font-satoshi font-medium text-gray-400">{timeNow}</Text>
                            }
                        </View>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <View>
                                <Text className="font-bold font-satoshi text-Primary/Main text-md">Ganti nomor Telepon</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default InputOTP