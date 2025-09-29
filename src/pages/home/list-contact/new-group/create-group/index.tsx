import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, ToastAndroid, Platform } from "react-native"
import ImagePicker from 'react-native-image-crop-picker';
import Components from "../../../../../components"
import Assets from "../../../../../assets"
import { FC, useCallback, useState } from "react"
import { createComunityRequest } from "../../../../../services/home/chat";
import { uploadFile } from "../../../../../helpers/uploadFile";
import { User } from "@pn/watch-is/model";
import { useFocusEffect } from "@react-navigation/native";
import { UserWithCheckBox } from "../chose-member";

interface InterfaceCreateGroup {
    navigation: any,
    route: {
        params: {
            listMember: User[]
        }
    }
}

const CreateGroup: FC<InterfaceCreateGroup> = ({ navigation, route }) => {
    let { listMember } = route.params
    const [keywords, setKeywords] = useState("")
    const [nameGroup, setNameGroup] = useState("")
    const [loadingCreateGroup, setLoadingCreateGroup] = useState(false)
    const [showSelectImage, setSelectImage] = useState({ status: false, path: "", mime: "" })
    const [memberList, setMemberList] = useState<UserWithCheckBox[]>([])

    const btnCreateGroup = async () => {
        setLoadingCreateGroup(true)
        try {
            // convert member format
            let member: string[] = []
            for (let i = 0; i < listMember.length; i++) {
                member.push(listMember[i].public_hash)
            }

            // upload logo jika ada gambar
            let uploadThumbnailUrl = ""
            if (showSelectImage.path && showSelectImage.mime) {
                const uploadThumbnail = await uploadFile(
                    Platform.OS === 'android' ? showSelectImage.path : showSelectImage.path.replace('file://', ''),
                    showSelectImage.mime
                )
                uploadThumbnailUrl = uploadThumbnail.data
            }

            console.log(uploadThumbnailUrl, 'uploadThumbnailUrluploadThumbnailUrl');

            const createGroup = await createComunityRequest(uploadThumbnailUrl, nameGroup, member as never)

            navigation.navigate("DetailChat", {
                public_hash: createGroup.public_identifier,
                isComunity: true
            })

        } catch (error) {
            ToastAndroid.show("Gagal membuat grub !", ToastAndroid.SHORT)

        } finally {
            setLoadingCreateGroup(false)
        }
    }

    const choseImageCamera = async () => {
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true,
            includeBase64: true,
            freeStyleCropEnabled: true,
            mediaType: 'photo'
        }).then((image: any) => {
            setSelectImage({
                path: image.path,
                mime: image.mime,
                status: false
            })

        }).catch((error: any) => {
            console.log("select image canceled !");
        });
    }

    const choseImageExplorer = async () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            includeBase64: true,
        }).then((image: any) => {
            setSelectImage({
                path: image.path,
                mime: image.mime,
                status: false
            })

        }).catch((error: any) => {
            ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
        });
    }

    const removeMemberFromGroup = async (item: User) => {
        if (memberList.length > 0) {
            let dataNotRemove = []
            for (let i = 0; i < memberList.length; i++) {
                if (item.public_hash !== memberList[i].public_hash) {
                    dataNotRemove.push(memberList[i])
                }
            }

            if (dataNotRemove.length > 0) {
                setMemberList(dataNotRemove)

            } else {
                navigation.goBack()
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (listMember !== null) {
                setMemberList(listMember)
            }
        }, [])
    )

    return (
        <View className="flex-1 p-4 bg-white">
            <View>
                <View className="flex-row items-center mb-2">
                    <View className="w-3/12">
                        <TouchableOpacity onPress={() => {
                            setSelectImage({
                                status: true,
                                path: "",
                                mime: ""
                            })
                        }}>
                            {
                                showSelectImage.path !== "" ?
                                    <Image source={{ uri: showSelectImage.path }} resizeMode="contain" width={80} height={80} className="rounded-full" />
                                    :
                                    <Assets.ImageInsert width={80} height={80} />

                            }
                        </TouchableOpacity>
                    </View>
                    <View className="w-9/12">
                        <View>
                            <TextInput
                                maxLength={64}
                                onChangeText={(value) => setNameGroup(value)}
                                value={nameGroup}
                                placeholderTextColor="#bdc3c7"
                                placeholder="Masukan nama grup"
                                className="h-[48px] px-2 py-1 border-b border-b-gray-300 w-full text-black"
                            />
                        </View>
                        <View className="py-1 items-end">
                            <Text className="font-satoshi text-xs text-gray-500">{nameGroup.length}/64</Text>
                        </View>
                    </View>
                </View>
                <View className="mt-5">
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            memberList.map((member: User, i) => (
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
                                <Assets.IconSearch width={15} height={15} />
                            </View>
                        }
                    />
                </View>
                <View>
                    <View>
                        <Text className="font-normal text-xs font-satoshi text-gray-800">{listMember.length} Anggota</Text>
                    </View>
                    <View className="mt-3">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {
                                memberList.length > 0 &&
                                memberList.map((memberGroup, i) => (
                                    <Components.ListContact
                                        item={memberGroup}
                                        key={i}
                                        showCheckbox={false}
                                    />
                                ))
                            }

                            <Components.AddAnggota />
                        </ScrollView>
                    </View>
                </View>
            </View>
            <View className="py-2 bg-white">
                <Components.Button
                    loading={loadingCreateGroup}
                    label="Buat Grup"
                    onPress={btnCreateGroup}
                />
            </View>


            {/* modals */}
            <Components.ModalsChoseImageFrom
                isShow={showSelectImage.status}
                handleClose={(value: boolean) => {
                    setSelectImage({
                        status: value,
                        path: "",
                        mime: ""
                    })
                }}
                fromCamera={choseImageCamera}
                fromFileExplorer={choseImageExplorer}
            />
        </View>
    )
}

export default CreateGroup