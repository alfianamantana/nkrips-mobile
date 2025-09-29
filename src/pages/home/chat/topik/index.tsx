import { Text, View, TouchableOpacity, ScrollView, TextInput } from "react-native"
import Components from "../../../../components"
import Assets from "../../../../assets"
import { FC, useState } from "react"

interface InterfaceTopik {
    navigation : any
}

const Topik:FC<InterfaceTopik> = ({ navigation }) => {
    const [keywords, setKeywords] = useState("")

    const btnTopik = () => {
        navigation.navigate("DetailChat")
    }

    return (
        <View className="flex-1 p-4 bg-white">
            <View>
                <View className="flex-row items-center mb-2">
                    <View className="w-3/12">
                        <Assets.ImageInsert width={80} height={80}/>
                    </View>
                    <View className="w-9/12">
                        <View>
                            <TextInput
                                placeholderTextColor="#bdc3c7"
                                placeholder="Masukan nama topik"
                                className="h-[48px] px-2 py-1 border-b border-b-gray-300 w-full text-black"
                            />
                        </View>
                        <View className="py-1 items-end">
                            <Text className="font-satoshi text-xs text-gray-500">0/64</Text>
                        </View>
                    </View>
                </View>
                <View className="py-4">
                    <Components.FormInput
                        onChange={() => {
                            return false
                        }}
                        isBackground={true}
                        label="Pilih Warna Topik"
                        placeholder="PINK"
                        value="PINK"
                        prefix={
                            <View className="pr-2">
                                <View className="w-[15px] h-[15px] rounded-full bg-success">
                                </View>
                            </View>
                        }
                        sufix={
                            <View className="rotate-180 items-end">
                                <Assets.IconArrowBack width={15} height={15}/>
                            </View>
                        }
                    />
                </View>
                <View className="mt-5">
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View className="items-center justify-center w-[60px] mr-3">
                            <View className="w-[45px] h-[45px] relative">
                                <Assets.ImageEmptyProfile width={45} height={45}/>

                                <View className="w-[20px] h-[20px] bg-gray-200 rounded-full items-center justify-center absolute bottom-[-5px] right-[-5px]">
                                    <Assets.IconMinus width={10} height={10}/>
                                </View>
                            </View>
                            <View className="mt-2">
                                <Text ellipsizeMode='tail' numberOfLines={1} className="font-satoshi text-sm text-black truncate">Jhon Doe</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <View className="flex-1 pt-3">
                <View className="pb-5">
                    <Components.FormInput
                        isBackground={true}
                        value={keywords}
                        onChange={setKeywords}
                        placeholder="Cari"
                        sufix={
                            <View>
                                <Assets.IconSearch width={15} height={15}/>
                            </View>
                        }
                    />
                </View>
                <View>
                    <View>
                        <Text className="font-normal text-xs font-satoshi text-gray-500">Teman 120</Text>
                    </View>
                    <View className="mt-3">
                        <TouchableOpacity onPress={() => navigation.navigate("DetailChat")} className="flex-row items-center my-1">
                            <View className="w-2/12">
                                <Assets.ImageEmptyProfile width={45} height={45}/>
                            </View>
                            <View className="w-10/12">
                                <Text className="font-satoshi text-black font-medium">Jane Doe</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className="py-2 bg-white">
                <Components.Button
                    label="Buat Topik"
                    onPress={btnTopik}
                />
            </View>
        </View>
    )
}

export default Topik