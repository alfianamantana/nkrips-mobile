import { View, Text, TouchableOpacity } from "react-native"
import Assets from "../../assets"
import Button from "../button"
import { useNavigation } from "@react-navigation/native"
import { FC } from "react"

interface JadabBannerInterface {
    closeBanner: (value: boolean) => void
}

const JadabBanner: FC<JadabBannerInterface> = ({ closeBanner }) => {
    const navigation: any = useNavigation()

    return (
        <View className="bg-white my-1 px-4 py-5 items-center">
            <View className="flex-row">
                <View className="flex-1">
                    <Text className="text-Neutral/70 font-satoshi">Ayo membangun sekonomi budaya Indonesia menjadi lebih baik dengan bergabung bersama kami!</Text>
                </View>
                <TouchableOpacity onPress={() => closeBanner(false)} className="pl-3">
                    <Assets.IconTimes />
                </TouchableOpacity>
            </View>

            <View className="mt-5 flex-row items-center">
                <View className="flex-1">
                    <View>
                        <Text className="font-satoshi text-Neutral/90 font-bold">JADAB</Text>
                    </View>
                    <View>
                        <Text className="font-satoshi text-Neutral/70">Jati diri Anak Bangsa</Text>
                    </View>
                </View>
                <View>
                    <Button
                        label="Gabung"
                        customHeight={35}
                        onPress={() => {
                            navigation.navigate("RegisterJadab")
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

export default JadabBanner