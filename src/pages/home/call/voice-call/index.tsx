import { View, Image, Text, TouchableOpacity } from "react-native"
import Assets from "../../../../assets"
import { FC } from "react"

interface interfaceVoiceCall {
    navigation : any
}

const VoiceCall:FC<interfaceVoiceCall> = ({ navigation }) => {
    
    const btnCloseCall = () => {
        navigation.goBack()
    }

    return (
        <View className="flex-1 relative">
            <View className="absolute left-0 top-0 w-full">
                <Image source={require("../../../../assets/images/image-background-call.png")} className="absolute left-0 top-0 w-full h-screen"/>
            </View>

            <View className="flex-1">
                <View className="items-center justify-center flex-1">
                    <View>
                        <Text className="font-satoshi font-medium text-white text-2xl">Jhon Doe</Text>
                    </View>
                    <View className="py-3">
                        <Text className="font-satoshi font-medium text-white text-sm">Menelpon ...</Text>
                    </View>
                </View>
                <View className="items-center justify-start flex-1">
                    <Assets.ImageEmptyProfile width={150} height={150}/>
                </View>
                <View className="flex-1 justify-center items-center flex-row px-4">
                    <TouchableOpacity className="flex-1 items-end">
                        <View className="w-[60px] h-[60px] bg-gray-500 rounded-full items-center justify-center">
                            <Assets.IconSound width={20} height={20}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center" onPress={() => btnCloseCall()}>
                        <View className="w-[80px] h-[80px] bg-Primary/Main rounded-full items-center justify-center">
                            <Assets.IconCallButtomWhite width={35} height={35}/>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity className="flex-1 items-center">
                        <View className="w-[80px] h-[80px] bg-success rounded-full items-center justify-center">
                            <Assets.IconCallTopWhite width={35} height={35}/>
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity className="flex-1">
                        <View className="w-[60px] h-[60px] bg-gray-500 rounded-full items-center justify-center">
                            <Assets.IconMicOff width={20} height={20}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default VoiceCall