import { FC, Fragment, useCallback, useEffect, useState } from "react"
import { FlatList, Image, RefreshControl, Text, ToastAndroid, View, ScrollView, TouchableOpacity } from "react-native"
import { addFriendRequest, profileContactRequest } from "../../../../services/home/profile"
import Assets from "../../../../assets"
import Components from "../../../../components"
import { Schema } from "@pn/watch-is/driver"
import { User, PostingType } from "@pn/watch-is/model"
import { listPostingByUserRequest } from "../../../../services/home/posting"
import { listContactPhoneNumberSearchRequest, listContactRequest } from "../../../../services/home/contact"
import { useFocusEffect } from "@react-navigation/native"
import ContextMenu from "react-native-context-menu-view"

interface PostProfileInterface {
    navigation: any,
    route: any,
}

const PostProfile: FC<PostProfileInterface> = ({ navigation, route }) => {
    const { username, isMyProfile } = route.params
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [isFriend, setIsFriend] = useState(false)
    const [dataProfile, setDataProfile] = useState<User | any>({})
    const [activeTab, setActiveTab] = useState(1)
    const [onScrolling, setOnScrolling] = useState(false)
    const [loadingListPost, setLoadingListPost] = useState(true)
    const [refreshing,] = useState(false)
    const [postData, setPostData] = useState<Schema.GetResponsePostingBody["data"]>([])
    const [loadingAddFriend, setLoadingAddFriend] = useState(false)

    const listDataPost = async (type: string = "") => {
        setLoadingListPost(true)
        try {
            const post = await listPostingByUserRequest(username, type)
            setPostData(post.data)

        } catch (error) {
            ToastAndroid.show("Gagal mengambil post data !", ToastAndroid.SHORT)

        } finally {
            setLoadingListPost(false)
        }
    }

    const profileData = async () => {
        setLoadingProfile(true)
        try {
            const detailProfile = await profileContactRequest(username)
            console.log(detailProfile, 'detailProfiledetailProfile');

            setDataProfile(detailProfile.user)

            if (isMyProfile === undefined) {
                searchFriend(detailProfile.phone_number!)
            }

        } catch (error) {
            ToastAndroid.show("Gagal mengambil profile data !", ToastAndroid.SHORT)

        } finally {
            setLoadingProfile(false)
        }
    }

    const addFriends = async (public_id: string) => {
        setLoadingAddFriend(true)
        try {
            await addFriendRequest(public_id)
            ToastAndroid.show("Berhasil menambahkan teman !", ToastAndroid.SHORT)

        } catch (error) {
            ToastAndroid.show("Gagal menambahkan teman !", ToastAndroid.SHORT)

        } finally {
            setTimeout(() => {
                setLoadingAddFriend(false)
            }, 1000)
        }
    }

    const searchFriend = async (number: string) => {
        try {
            const search: any = await listContactPhoneNumberSearchRequest(number)
            if (search.already_friend) {
                setIsFriend(true)
            }

        } catch (error) {
            ToastAndroid.show("Gagal medapatkan pengguna !", ToastAndroid.SHORT)
        }
    }

    useFocusEffect(
        useCallback(() => {
            profileData()
        }, [])
    )

    useEffect(() => {
        if (activeTab === 1) {
            listDataPost()
        }

        if (activeTab === 2) {
            listDataPost(PostingType.VIDEO)
        }

        if (activeTab === 3) {
            listDataPost(PostingType.SELL_PRODUCT)
        }
    }, [activeTab])

    return (
        <View className="bg-gray-100 flex-1">
            {
                !onScrolling &&
                <Fragment>
                    <View>
                        <Image source={require("../../../../assets/images/image-background-profile.png")} className="w-full h-[130px]" />
                    </View>
                    <View className="px-4 bg-white mb-2">
                        <View className="flex-row">
                            <View className="flex-1 top-[-35px]">
                                <View className="w-[90px] h-[90px] bg-white rounded-full justify-center items-center">
                                    {
                                        (Object.keys(dataProfile).length > 0 && dataProfile.profile_picture_url !== null) ?
                                            <Image source={{ uri: dataProfile.profile_picture_url }} className="w-[80px] h-[80px] rounded-full" />
                                            :
                                            <Assets.ImageEmptyProfile width={80} height={80} />
                                    }
                                </View>
                                <View className="mt-1 flex-row items-center">
                                    <View className="flex-1">
                                        <View>
                                            {
                                                loadingProfile ?
                                                    <View className="h-[20px] rounded-md bg-gray-100 w-4/12 animate-pulse">
                                                    </View>
                                                    :
                                                    Object.keys(dataProfile).length > 0 &&
                                                    <Text className="font-satoshi text-black text-lg font-bold">{dataProfile.name}</Text>

                                            }
                                        </View>
                                        <View className="mt-1">
                                            <Text className="font-satoshi text-gray-700">Avaliable</Text>
                                        </View>

                                        {
                                            isMyProfile === undefined &&
                                            <View className="flex-row items-center mt-5">
                                                <View className="w-5/12 pr-1">
                                                    <Components.Button
                                                        customHeight={37}
                                                        label={`${!isFriend ? "Tambah" : ""} Teman`}
                                                        customIcon={isFriend ? "" : <Assets.IconPlusWhite width={20} height={20} />}
                                                        onPress={() => {
                                                            !isFriend &&
                                                                Object.keys(dataProfile).length > 0 &&
                                                                addFriends(dataProfile.public_hash)
                                                        }}
                                                        loading={loadingAddFriend}
                                                    />
                                                </View>
                                                <View className="w-5/12 px-1">
                                                    <Components.Button
                                                        label="Pesan"
                                                        customHeight={37}
                                                        customIcon={<Assets.IconMessageRed width={20} height={20} />}
                                                        customColor="bg-Primary/Main/10"
                                                        customColorText="text-Primary/Main"
                                                        onPress={
                                                            Object.keys(dataProfile).length > 0 ?
                                                                () => {
                                                                    navigation.navigate("DetailChat", {
                                                                        public_hash: dataProfile.public_hash
                                                                    })
                                                                }
                                                                :
                                                                () => { }
                                                        }
                                                    />
                                                </View>
                                                <View className="w-2/12 pl-1">
                                                    <ContextMenu
                                                        actions={[
                                                            {
                                                                title: "Blokir"
                                                            },
                                                            {
                                                                title: "Laporkan"
                                                            }
                                                        ]}
                                                        onPress={(e) => {
                                                            console.log("e => ", e.nativeEvent);
                                                        }}
                                                        dropdownMenuMode={true}
                                                    >
                                                        <Components.Button
                                                            label=""
                                                            customHeight={37}
                                                            customIcon={<Assets.IconMore width={20} height={20} />}
                                                            customColor="bg-gray-100"
                                                            customColorText="text-Primary/Main"
                                                            onPress={() => { }}
                                                        />
                                                    </ContextMenu>
                                                </View>
                                            </View>
                                        }
                                    </View>


                                    {
                                        (isMyProfile !== undefined && isMyProfile === true) &&
                                        <TouchableOpacity onPress={() => navigation.navigate("EditProfile", {
                                            username: username
                                        })}>
                                            <Assets.IconEdit />
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </Fragment>
            }

            {/* <View className="px-4 pt-4 bg-white mb-2 flex-row items-center">
                <Components.Tabs
                    dataTab={[
                        {
                            label: "Postingan",
                            value: 1
                        },
                        {
                            label: "Video",
                            value: 2
                        },
                        {
                            label: "Jual Beli",
                            value: 3
                        }
                    ]}
                    activeValueTab={activeTab}
                    onPress={setActiveTab}
                />
            </View> */}

            <View className="mb-2 flex-1">
                {
                    loadingListPost ?
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {
                                [...Array(10)].map((e, i) => (
                                    <View key={i} className="my-1 bg-gray-200 rounded-md animate-pulse h-[300px]">
                                    </View>
                                ))
                            }
                        </ScrollView>
                        :
                        postData.length > 0 ?
                            <FlatList
                                onStartReached={() => { setOnScrolling(false) }}
                                onScrollEndDrag={() => { setOnScrolling(true) }}
                                removeClippedSubviews
                                initialNumToRender={5}
                                data={postData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={listDataPost} />}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Components.ListPost
                                            key={index}
                                            dataPost={item}
                                        />
                                    )
                                }}
                                // onEndReached={handlePagination}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={() => (
                                    <Fragment>
                                        {/* {
                                        pagesManager.page < pagesManager.totalPages &&
                                        <Components.LoadMore/>
                                    } */}
                                    </Fragment>
                                )}
                            />
                            :
                            <View className="justify-center items-center flex-1">
                                <Text className="font-satoshi font-medium text-Primary/Main">Belum ada postingan !</Text>
                            </View>
                }
            </View>
        </View>
    )
}

export default PostProfile
