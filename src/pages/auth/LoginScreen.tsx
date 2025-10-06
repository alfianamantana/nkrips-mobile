import { Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import { FC, useEffect, useState } from "react"
import Assets from "../../assets"
import Components from "../../components"
import SplashScreen from "react-native-splash-screen"
import { loginRequest } from "../../services/auth/login"
import { typeOTP } from "../../enums"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface LoginInterface {
  navigation: any
}

const Login: FC<LoginInterface> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [loadingLogin, setLoadingLogin] = useState(false)

  const ProccessLogin = async () => {
    setErrorMsg("")
    setLoadingLogin(true)

    try {
      const checkLogin = await loginRequest(phoneNumber)
      await AsyncStorage.setItem("totalCountDown", "60")

      navigation.navigate("InputOTP", {
        TypePage: typeOTP.LOGIN,
        hash: checkLogin.hash,
        phoneNumber: phoneNumber
      })

    } catch (error: any) {
      setErrorMsg(error.response.data)

    } finally {
      setLoadingLogin(false)
    }
  }

  useEffect(() => {
    SplashScreen.hide()

    return () => {
      setErrorMsg("")
    }
  }, [])

  return (
    <View className="flex-1 bg-white">
      <View className="justify-center items-center flex-1">
        <Assets.ImageLogo />
      </View>
      <View className="flex-1 border border-gray-200 rounded-t-3xl p-5">
        <View>
          <Text className="font-satoshi font-medium text-gray-600 text-xl">Masuk Akun</Text>
        </View>
        <View className="my-2 flex-row">
          <Text className="font-satoshi text-gray-400 text-md">Belum punya akun ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="font-satoshi font-bold text-md text-Primary/Main">Daftar Sekarang</Text>
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
              label="Masuk"
              onPress={ProccessLogin}
              loading={loadingLogin}
              isDisabled={phoneNumber !== "" ? false : true}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Login