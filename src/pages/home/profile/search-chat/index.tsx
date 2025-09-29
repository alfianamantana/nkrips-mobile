import { Text, View } from "react-native"

const SearchChat = () => {
    return (
        <View className="flex-1 bg-white p-4">
            {
                [...Array(5)].map((e,i) => {
                    return (
                        <View className="my-3" key={i}>
                            <View className="flex-row">
                                <View className="w-6/12">
                                    <Text className="font-satoshi text-gray-700">
                                        Jhon Doe
                                    </Text>
                                </View>
                                <View className="w-6/12 items-end">
                                    <Text className="font-satoshi text-gray-700 text-xs">
                                        10.00
                                    </Text>
                                </View>
                            </View>
                            <View className="mt-2">
                                <Text className="font-satoshi text-black text-xs">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi, ducimus?
                                </Text>
                            </View>
                        </View>
                    )
                })
            }
        </View>
    )
}

export default SearchChat