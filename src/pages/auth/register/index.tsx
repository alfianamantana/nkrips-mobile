import { Text, ToastAndroid, TouchableOpacity, View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from "react-native"
import { FC, useEffect, useState } from "react"
import Assets from "../../../assets"
import Components from "../../../components"
import { registerRequest } from "../../../services/auth/register"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface RegisterInterface {
    navigation: any
}

const Register: FC<RegisterInterface> = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [loadingRegister, setLoadingRegister] = useState(false)

    const ProccessRegister = async () => {
        setLoadingRegister(true)
        try {
            const checkRegister = await registerRequest(phoneNumber)
            await AsyncStorage.setItem("totalCountDown", "60")
            await AsyncStorage.setItem("isRegisterFinish", "false")

            navigation.navigate("InputOTP", {
                TypePage: "REGISTER",
                hash: checkRegister.hash,
                phoneNumber: phoneNumber
            })

        } catch (error: any) {
            setErrorMsg(error.response.data)

        } finally {
            setLoadingRegister(false)
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-white">
                    <View className="justify-center items-center flex-1">
                        <Assets.ImageLogo />
                    </View>
                    <View className="flex-1 border border-gray-200 rounded-t-3xl p-5">
                        <View>
                            <Text className="font-satoshi font-medium text-gray-600 text-xl">Daftar Akun</Text>
                        </View>
                        <View className="my-2 flex-row">
                            <Text className="font-satoshi text-gray-400 text-md">Sudah punya akun ? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text className="font-satoshi font-bold text-md text-Primary/Main">Masuk Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="mt-5">
                            <View className="my-3">
                                <Components.FormInput
                                    msg={errorMsg}
                                    label="Nomor Telepon"
                                    inputType="number"
                                    placeholder="Masukan nomor telepon"
                                    onChange={setPhoneNumber}
                                    value={phoneNumber}
                                    prefix={
                                        <View>
                                            <Text className="font-satoshi text-black text-sm">+62 |</Text>
                                        </View>
                                    }
                                />
                            </View>
                            <View>
                                <Components.Button
                                    label="Daftar"
                                    onPress={ProccessRegister}
                                    loading={loadingRegister}
                                    isDisabled={phoneNumber !== "" ? false : true}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Register