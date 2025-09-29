import { Text, TouchableOpacity, View } from "react-native"
import Assets from "../../assets"
import { useNavigation } from "@react-navigation/native"

const ListCall = () => {
    const navigation = useNavigation()

    return (
        <View className="my-2 flex-row items-center">
            <TouchableOpacity className="pr-3" onPress={() => navigation.navigate("Profile" as never)}>
                <Assets.ImageEmptyProfile width={60} height={60}/>
            </TouchableOpacity>
            <View className="flex-1">
                <View>
                    <Text className="font-satoshi font-medium text-sm text-black">Jhon Doe</Text>
                </View>
                <View className="flex-row items-center mt-2">
                    <View className="pr-2">
                        <Assets.IconArrowGreen width={20} height={20}/>
                    </View>
                    <View className="flex-1">
                        <Text className="font-satoshi text-success text-xs">20 Juni 2020 15.00</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity className="items-center justify-center" onPress={() => navigation.navigate("VoiceCall" as never)}>
                <Assets.IconCallBlack width={25} height={25}/>
            </TouchableOpacity>
        </View>
    )
}

export default ListCall