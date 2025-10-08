import { FlatList, Image, RefreshControl, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import Assets from "../../../../assets"
import { FC, useCallback, useEffect, useState } from "react"
import Components from "../../../../components"
import { useFocusEffect } from "@react-navigation/native"
import { listGroupRequest } from "../../../../services/home/contact"
import { CommunityData } from '../../../../constants/interface'

interface MyGroupInterface {
    navigation: any
}

const MyGroup: FC<MyGroupInterface> = ({ navigation }) => {
    const [refreshing,] = useState(false)
    const [loading, setLoading] = useState(true)
    const [listGroupData, setListGroupData] = useState<CommunityData[]>([])
    const [keywords, setKeywords] = useState("")

    const getGroup = async (keywords: string = "") => {
        setLoading(true)
        try {
            const group = await listGroupRequest(keywords)

            setListGroupData(group.data)

        } catch (error) {
            ToastAndroid.show("Gagal menampilkan daftar grup !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getGroup()
        }, [])
    )

    // search debounce
    useEffect(() => {
        const debounce = setTimeout(() => {
            getGroup(keywords)
        }, 500)

        return () => {
            clearTimeout(debounce)
        }
    }, [keywords])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={['bottom']}>
            <View className="flex-1 p-4">
                <TouchableOpacity className="flex-row items-center" onPress={() => navigation.navigate("ChoseMemberGroup")}>
                    <View className="w-2/12">
                        <Assets.ImageNewGroup width={45} height={45} />
                    </View>
                    <View className="w-8/12">
                        <Text className="font-satoshi text-black font-medium text-md">
                            Buat Group Baru
                        </Text>
                    </View>
                    <View className="w-2/12 items-end">
                        <Assets.IconArrowRight />
                    </View>
                </TouchableOpacity>
                <View className="flex-1 pt-3">
                    <View className="pb-5">
                        <Components.FormInput
                            isBackground={true}
                            value={keywords}
                            onChange={setKeywords}
                            placeholder="Cari"
                            sufix={
                                <View>
                                    <Assets.IconSearch width={15} height={15} />
                                </View>
                            }
                        />
                    </View>
                    <View>
                        <View className="mt-3">
                            {
                                loading ?
                                    [...Array(10)].map((e, i) => (
                                        <View className="flex-row items-center my-2" key={i}>
                                            <View className="w-[45px] h-[45px] rounded-full bg-gray-100 animate-pulse">
                                            </View>
                                            <View className="flex-1 pl-3">
                                                <View className="h-[17px] rounded-md bg-gray-100 animate-pulse">
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                    :
                                    <FlatList
                                        removeClippedSubviews
                                        initialNumToRender={5}
                                        data={listGroupData}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getGroup} />}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate("DetailChat", {
                                                            public_hash: item.otm_id_community.public_identifier,
                                                            isComunity: true
                                                        })
                                                    }}
                                                    key={index}
                                                    className="flex-row items-center my-2"
                                                >
                                                    {
                                                        item.otm_id_community.logo ?
                                                            <Image source={{ uri: item.otm_id_community.logo }} width={50} height={50} className="rounded-full" />
                                                            : <View
                                                                style={{
                                                                    width: 30,
                                                                    height: 30,
                                                                    borderRadius: 9999,
                                                                    backgroundColor: "#E4E4E7",
                                                                    justifyContent: "center",
                                                                    alignItems: "center"
                                                                }}
                                                            >
                                                                <Image source={Assets.ImageNkrips} style={{ width: 40, height: 40 }} />
                                                            </View>
                                                    }
                                                    <View>
                                                        <View className="flex-row items-center pl-3 flex-1">
                                                            <Text className="font-satoshi text-Neutral/90">{item.otm_id_community.name}</Text>
                                                            <Text className="font-satoshi text-Neutral/50 ml-1">({item.otm_id_community.total_member})</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                        // onEndReached={handlePagination}
                                        onEndReachedThreshold={0.5}
                                    // ListFooterComponent={() => (
                                    //     <Components.LoadMore isEndPages={false} label="Memuat group ..."/>
                                    // )}
                                    />
                            }
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default MyGroup