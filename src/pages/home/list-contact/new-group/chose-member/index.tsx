import { Text, View, TouchableOpacity, ScrollView, FlatList, RefreshControl, ToastAndroid, Image } from "react-native"
import Components from "../../../../../components"
import Assets from "../../../../../assets"
import { FC, useEffect, useState } from "react"
import { listContactRequest } from "../../../../../services/home/contact"
import { User } from "@pn/watch-is/model"
import { SaveOptions, RemoveOptions } from "typeorm"

interface InterfaceChoseMember {
    navigation: any
}

export type UserWithCheckBox = User & {
    isChecked?: boolean
}

const ChoseMember: FC<InterfaceChoseMember> = ({ navigation }) => {
    const [refreshing,] = useState(false)
    const [keywords, setKeywords] = useState("")
    const [loading, setLoading] = useState(true)
    const [listContactData, setListContactData] = useState<UserWithCheckBox[]>([])
    const [totalFriend, setTotalFriend] = useState<number>(0)
    const [listAddGroup, setListAddGroup] = useState<User[]>([])

    const btnNext = () => {
        navigation.navigate("CreateGroup", {
            listMember: listAddGroup
        })
    }

    const getFriends = async () => {
        setLoading(true)
        try {
            const list = await listContactRequest()
            const result = list.data
            let convertAddCheckBox: UserWithCheckBox[] = []

            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    convertAddCheckBox.push({
                        ...result[i],
                        isChecked: false,
                        hasId: function (): boolean {
                            throw new Error("Function not implemented.")
                        },
                        save: function (options?: SaveOptions): Promise<UserWithCheckBox> {
                            throw new Error("Function not implemented.")
                        },
                        remove: function (options?: RemoveOptions): Promise<UserWithCheckBox> {
                            throw new Error("Function not implemented.")
                        },
                        softRemove: function (options?: SaveOptions): Promise<UserWithCheckBox> {
                            throw new Error("Function not implemented.")
                        },
                        recover: function (options?: SaveOptions): Promise<UserWithCheckBox> {
                            throw new Error("Function not implemented.")
                        },
                        reload: function (): Promise<void> {
                            throw new Error("Function not implemented.")
                        }
                    })
                }

                setListContactData(convertAddCheckBox)
                setTotalFriend(list.total)
            }

        } catch (error) {
            ToastAndroid.show("Gagal memuat daftar teman ...", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    const addMemberToGroup = async (status: boolean, item: User) => {
        for (let p = 0; p < listContactData.length; p++) {
            if (item.public_hash === listContactData[p].public_hash) {

                listContactData[p].isChecked = status
                if (!status) {
                    removeMemberFromGroup(item)
                }

            }
        }

        setListContactData(listContactData)

        let isNew = true
        for (let i = 0; i < listAddGroup.length; i++) {
            if (listAddGroup[i].public_hash === item.public_hash) {
                isNew = false
            }
        }

        if (isNew) {
            const newMember = [item]
            const combine = [...listAddGroup, ...newMember]

            setListAddGroup(combine)
        }
    }

    const removeMemberFromGroup = async (item: User) => {
        if (listAddGroup.length > 0) {
            let dataNotRemove = []
            for (let i = 0; i < listAddGroup.length; i++) {
                if (item.public_hash !== listAddGroup[i].public_hash) {
                    dataNotRemove.push(listAddGroup[i])
                }
            }

            // remove check
            for (let p = 0; p < listContactData.length; p++) {
                if (item.public_hash === listContactData[p].public_hash) {
                    listContactData[p].isChecked = false
                }
            }

            setListAddGroup(dataNotRemove)
        }
    }

    useEffect(() => {
        getFriends()
    }, [])

    return (
        <View className="flex-1 px-4 bg-white">
            {
                listAddGroup.length > 0 &&
                <View className="pb-3">
                    <View className="py-3">
                        <Text className="font-normal text-xs font-satoshi text-gray-800">{listAddGroup.length} Dipilih</Text>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            listAddGroup.map((member: User, i) => (
                                <View key={i} className="items-center justify-center w-[60px] mr-3">
                                    <View className="w-[45px] h-[45px] relative">
                                        {
                                            member.profile_picture_url !== null ?
                                                <Image source={{ uri: member.profile_picture_url }} width={45} height={45} className="rounded-full" />
                                                :
                                                <Assets.ImageEmptyProfile width={45} height={45} />
                                        }

                                        <TouchableOpacity onPress={() => removeMemberFromGroup(member)} className="w-[20px] h-[20px] bg-gray-200 rounded-full items-center justify-center absolute bottom-[-5px] right-[-5px]">
                                            <Assets.IconMinus width={10} height={10} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="mt-2">
                                        <Text numberOfLines={1} className="font-satoshi text-sm text-black truncate">{member.name}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
            }

            <View className="flex-1">
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
                        <Text className="font-normal text-xs font-satoshi text-gray-800">Teman {totalFriend}</Text>
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
                                                pressCheckBox={addMemberToGroup}
                                                showCheckbox={true}
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
            <View className="py-2 bg-white">
                <Components.Button
                    label="Selanjutnya"
                    onPress={btnNext}
                />
            </View>
        </View>
    )
}

export default ChoseMember