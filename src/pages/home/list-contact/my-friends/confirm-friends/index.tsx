import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import Assets from "../../../../../assets"
import Components from "../../../../../components"

const ConfirmFriends = () => {

    const acceptFriends = async () => {

    }

    const rejectFriends = async () => {
        
    }

    return (
        <View className="flex-1 bg-white p-4">
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    [...Array(10)].map((e, i) => (
                        <View key={i} className="flex-row items-center mb-4">
                            <View>
                                <Assets.ImageEmptyProfile width={60} height={60}/>
                            </View>
                            <View className="flex-1 pl-4">
                                <View>
                                    <Text className="font-satoshi text-Neutral/90 font-medium">Jhon123</Text>
                                </View>
                                <View className="mt-1">
                                    <Text className="font-satoshi text-Neutral/70 text-xs">( Jhon123 )</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={() => acceptFriends()} className="mr-2">
                                    <Assets.IconBtnReject width={30} height={30}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => rejectFriends()}>
                                    <Assets.IconBtnAccept width={30} height={30}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}

export default ConfirmFriends