import { FlatList, RefreshControl, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import Assets from "../../../assets"
import Components from "../../../components"
import { FC, useEffect, useState } from "react"
import { listContactPhoneNumberSearchRequest, listContactRequest } from "../../../services/home/contact"
import { User } from "@pn/watch-is/model"

interface ListContactInterface {
    navigation: any
}

const ListContact: FC<ListContactInterface> = ({ navigation }) => {
    const [refreshing,] = useState(false)
    const [keywords, setKeywords] = useState("")
    const [loading, setLoading] = useState(true)
    const [listContactData, setListContactData] = useState<User[]>([])
    const [totalFriend, setTotalFriend] = useState<number>(0)

    const getFriends = async (page = 1) => {
        setLoading(true)
        try {
            const list = await listContactRequest()
            setListContactData(list.data)
            setTotalFriend(list.total)

        } catch (error) {
            ToastAndroid.show("Gagal menampilkan daftar kontak !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    const searchFriends = async (keywords = "") => {
        setLoading(true)
        try {
            const list = await listContactPhoneNumberSearchRequest(keywords)
            // setListContactData(list.data)
            // setTotalFriend(list.total)

        } catch (error) {
            ToastAndroid.show("Gagal menampilkan daftar kontak !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getFriends()
    }, [])

    // search debounce
    useEffect(() => {
        const debounce = setTimeout(() => {
            // searchFriends(keywords)
        }, 500)

        return () => {
            clearTimeout(debounce)
        }
    }, [keywords])

    return (
        <View className="flex-1 p-4 bg-white">
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
                    <View>
                        {
                            loading ?
                                <View className="h-[15px] w-[100px] rounded-md bg-gray-100 animate-pulse"></View>
                                :
                                <Text className="font-normal text-xs font-satoshi text-gray-500">Teman {totalFriend}</Text>
                        }
                    </View>
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
                                    inverted
                                    data={listContactData}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getFriends} />}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Components.ListContact
                                                key={index}
                                                item={item}
                                                showCheckbox={false}
                                            />
                                        )
                                    }}
                                    // onEndReached={handlePagination}
                                    onEndReachedThreshold={0.5}
                                // ListFooterComponent={() => (
                                //     <Components.LoadMore isEndPages={false} label="Memuat Teman ..."/>
                                // )}
                                />
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ListContact