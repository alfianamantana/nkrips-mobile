import { View, Text, TouchableOpacity } from "react-native"
import Assets from "../../assets"
import ContainerModals from "../modalsContainer"
import { storeShowMenuChat } from "../../store"
import { useNavigation } from "@react-navigation/native"

const MenuChat = () => {
    const navigation = useNavigation()
    const { showMenuChat, setShowMenuChat } = storeShowMenuChat()

    return (
        <ContainerModals isShow={showMenuChat} handleClose={setShowMenuChat}>
            <View className="right-2 top-[65px] w-full bg-white rounded-md p-4 border border-gray-100">
                <TouchableOpacity className="flex-row items-center my-2" onPress={() => navigation.navigate("CreateTopik" as never)}>
                    <View className="pr-3">
                        <Assets.IconCreateTopic width={20} height={20}/>
                    </View>
                    <View>
                        <Text className="font-satoshi text-black font-medium text-xs">
                            Buat Topik
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center my-2">
                    <View className="pr-3">
                        <Assets.IconSearch width={20} height={20}/>
                    </View>
                    <View>
                        <Text className="font-satoshi text-black font-medium text-xs">
                            Cari
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center my-2">
                    <View className="pr-3">
                        <Assets.IconNotifOff width={20} height={20}/>
                    </View>
                    <View>
                        <Text className="font-satoshi text-black font-medium text-xs">
                            Bisukan Notifikasi
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center my-2">
                    <View className="pr-3">
                        <Assets.IconTrashRed width={20} height={20}/>
                    </View>
                    <View>
                        <Text className="font-satoshi text-Primary/Main font-medium text-xs">
                            Hapus Chat
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ContainerModals>
    )
}

export default MenuChat