import { ScrollView, Text, View } from "react-native"
import Components from "../../../../components"
import Assets from "../../../../assets"

const BlockHistory = () => {

    const openBlock = () => {

    }

    return (
        <View className="p-4 bg-white flex-1">
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
                            <View>
                                <Components.Button
                                    onPress={openBlock}
                                    label="Buka Blokir"
                                    customHeight={35}
                                    customColor="bg-Neutral/30"
                                    customColorText="text-Neutral/90"
                                />
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}

export default BlockHistory