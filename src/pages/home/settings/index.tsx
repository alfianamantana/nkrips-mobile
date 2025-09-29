import { Text, View, TouchableOpacity } from "react-native"
import Assets from "../../../assets"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

const Setting = () => {
    const navigation: any = useNavigation()

    const logout = async () => {
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("isRegisterFinish")
        await AsyncStorage.removeItem("user")
        navigation.navigate("Login" as never)
    }

    return (
        <View className="p-4 bg-white">
            {/* <TouchableOpacity onPress={() => navigation.navigate("ChangeNumber")} className="flex-row my-2 items-center">
                <View>
                    <Assets.IconPhoneBlack width={25} height={25} />
                </View>
                <View className="flex-1 pl-3">
                    <Text className="font-satoshi text-black font-medium">Ganti Nomor Telepon</Text>
                </View>
                <View>
                    <Assets.IconArrowBack width={15} height={15} className="rotate-180" />
                </View>
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={() => navigation.navigate("BlockHistory")} className="flex-row my-2 items-center">
                <View>
                    <Assets.IconUserTimes width={25} height={25}/>
                </View>
                <View className="flex-1 pl-3">
                    <Text className="font-satoshi text-black font-medium">Riwayat Blokir</Text>
                </View>
                <View>
                    <Assets.IconArrowBack width={15} height={15} className="rotate-180"/>
                </View>
            </TouchableOpacity> */}

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("TermsAndCondition", {
                        isRegister: false
                    })
                }}
                className="flex-row my-2 items-center"
            >
                <View>
                    <Assets.IconDocumentBlack width={25} height={25} />
                </View>
                <View className="flex-1 pl-3">
                    <Text className="font-satoshi text-black font-medium">Syarat & Ketentuan</Text>
                </View>
                <View>
                    <Assets.IconArrowBack width={15} height={15} className="rotate-180" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("HelpCenter")} className="flex-row my-2 items-center">
                <View>
                    <Assets.IconQuestion width={25} height={25} />
                </View>
                <View className="flex-1 pl-3">
                    <Text className="font-satoshi text-black font-medium">Pusat Bantuan</Text>
                </View>
                <View>
                    <Assets.IconArrowBack width={15} height={15} className="rotate-180" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row my-2 items-center" onPress={() => logout()}>
                <View>
                    <Assets.IconLogout width={25} height={25} />
                </View>
                <View className="flex-1 pl-3">
                    <Text className="font-satoshi text-Primary/Main font-medium">Keluar Aplikasi</Text>
                </View>
                <View>
                    <Assets.IconArrowBack width={15} height={15} className="rotate-180" />
                </View>
            </TouchableOpacity>

        </View>
    )
}

export default Setting