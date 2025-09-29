import { Text, View } from "react-native"
import Assets from "../../../../assets"
import Components from "../../../../components"
import { FC } from "react"

interface MyBadgeInterface {
    navigation: any
}

const MyBadge: FC<MyBadgeInterface> = ({ navigation }) => {
    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-1 justify-center">
                <View className="items-center">
                    <Assets.ImageBadgeTransparant width={120} height={120} />
                </View>
                <View className="mt-3">
                    <Text className="font-satoshi text-Neutral/90 text-center text-lg font-medium">Anda tidak punya lencana!</Text>
                </View>
                <View className="my-5">
                    <Text className="font-satoshi text-Neutral/70 text-center text-sm">Daftar ke Komunitas Jadab untuk mendapatkan lencana Bronze!</Text>
                </View>
                <View>
                    <Components.Button
                        label="Daftar Komunitas Jadab"
                        onPress={() => {
                            navigation.navigate("RegisterJadab")
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

export default MyBadge;
