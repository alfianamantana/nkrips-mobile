import { ScrollView, Text, View } from "react-native"
import Assets from "../../../assets"

const Search = () => {
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
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}

export default Search