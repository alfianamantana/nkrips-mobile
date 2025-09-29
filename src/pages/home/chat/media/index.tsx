import { Text, View } from "react-native"
import Components from "../../../../components"
import { useState } from "react"
import Assets from "../../../../assets"

const MediaChat = () => {
    const [activeTab, setActiveTab] = useState(1)

    return (
        <View className="flex-1 bg-white p-4">
            <View className="pb-3">
                <Components.Tabs
                    activeValueTab={activeTab}
                    onPress={setActiveTab}
                    dataTab={[
                        {
                            label : "Foto & Video",
                            value : 1
                        },
                        {
                            label : "Dokumen",
                            value : 2
                        },
                        {
                            label : "Link",
                            value : 3
                        },
                    ]}
                />
            </View>
            <View className="flex-1">
                {
                    activeTab === 1 &&
                    <View className="flex-row flex-wrap">
                        {
                            [...Array(9)].map((e, i) => (
                                <View className="w-4/12 p-1" key={i}>
                                    <View className="bg-Neutral/30 rounded-lg w-full h-[100px]">

                                    </View>
                                </View>
                            ))
                        }
                    </View>
                }

                {
                    activeTab === 2 &&
                    <View>
                        <View className="my-2 bg-Neutral/20 p-4 rounded-md flex-row items-center">
                            <View>
                                <Assets.IconZip width={40} height={40}/>
                            </View>
                            <View className="pl-3">
                                <View>
                                    <Text className="font-satoshi font-medium text-Neutral/90">Lorem ipsum dolor sit amet.zip</Text>
                                </View>
                                <View>
                                    <Text className="font-satoshi text-Neutral/70">1.1 MB</Text>
                                </View>
                            </View>
                        </View>

                        <View className="my-2 bg-Neutral/20 p-4 rounded-md flex-row items-center">
                            <View>
                                <Assets.IconPdf width={40} height={40}/>
                            </View>
                            <View className="pl-3">
                                <View>
                                    <Text className="font-satoshi font-medium text-Neutral/90">Lorem ipsum dolor sit amet.pdf</Text>
                                </View>
                                <View>
                                    <Text className="font-satoshi text-Neutral/70">1.1 MB</Text>
                                </View>
                            </View>
                        </View>

                        <View className="my-2 bg-Neutral/20 p-4 rounded-md flex-row items-center">
                            <View>
                                <Assets.IconMp3 width={40} height={40}/>
                            </View>
                            <View className="pl-3">
                                <View>
                                    <Text className="font-satoshi font-medium text-Neutral/90">Lorem ipsum dolor sit amet.mp3</Text>
                                </View>
                                <View>
                                    <Text className="font-satoshi text-Neutral/70">1.1 MB</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }

                {
                    activeTab === 3 &&
                    <View>
                        <View className="my-2 bg-Neutral/20 p-4 rounded-md flex-row items-center">
                            <View>
                                <Assets.IconLink width={40} height={40}/>
                            </View>
                            <View className="pl-3">
                                <View>
                                    <Text className="font-satoshi font-medium text-Neutral/90">https://google.com</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }
            </View>
        </View>
    )
}

export default MediaChat