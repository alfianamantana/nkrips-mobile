import { Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import Assets from "../../../assets"
import Components from "../../../components"
import { FC, useCallback, useState } from "react"
import { addToAdminGroupRequest, leaveGroupRequest, myGroupRequest, profileContactRequest, removeFromAdminGroupRequest, memberCommunity } from "../../../services/home/profile"
import { Schema } from "@pn/watch-is/driver"
import { AttachmentType, Community } from "@pn/watch-is/model"
import { useFocusEffect } from "@react-navigation/native"
import ContextMenu from "react-native-context-menu-view"
import ImagePicker from "react-native-image-crop-picker"
import { CommunityMember } from "../../../constants/interface"
import { api } from "../../../services/api"
import { uploadFile } from "../../../helpers/uploadFile"
import { ProfileDetail } from "../../../constants/interface"
interface ProfileInterface {
    navigation: any,
    route: any
}

const Profile: FC<ProfileInterface> = ({ navigation, route }) => {
    const { username, public_id, isGroup } = route.params
    const [loading, setLoading] = useState(true)
    const [loadingLeave, setLoadingLeave] = useState(false)
    const [detailDataProfile, setDetailDataProfile] = useState<ProfileDetail | any>({})
    const [detailDataGroup, setDetailDataGrup] = useState<Community | null>(null)
    const [memberGroupList, setMemberGroupList] = useState<CommunityMember[]>([])
    const [showBlockModal, setShowBlockModal] = useState(false)
    const [blockMode, setBlockMode] = useState<"block" | "unblock">("block")
    const [showReportModal, setShowReportModal] = useState(false)
    const [reportDescription, setReportDescription] = useState("")
    const [reportImages, setReportImages] = useState<Array<{ uri: string, mime: string }>>([])
    const [uploading, setUploading] = useState(false)

    const openImagePicker = async () => {
        try {
            const images = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo'
            })
            // Jika hanya satu gambar, images bisa berupa object, jika multiple, array
            if (Array.isArray(images)) {
                setReportImages(images.map(img => ({ uri: img.path, mime: img.mime })))
            } else {
                setReportImages([{ uri: images.path, mime: images.mime }])
            }
        } catch (e) {
            ToastAndroid.show("Batal memilih gambar", ToastAndroid.SHORT)
        }
    }

    const submitReport = async () => {
        setUploading(true)
        try {
            let media: { url: string }[] = []
            // Upload semua gambar terlebih dahulu
            for (let img of reportImages) {
                const res = await uploadFile(
                    Platform.OS === "android" ? img.uri : img.uri.replace("file://", ""),
                    img.mime
                )
                media.push({ url: res.data.url || res.data })

            }

            if (isGroup) {
                await api({
                    url: `/community/by-public-id/${detailDataGroup?.public_identifier}/report`,
                    method: "POST",
                    data: {
                        media,
                        description: reportDescription
                    },
                })
            } else {
                await api({
                    url: `/user/${public_id}/report`,
                    method: "POST",
                    data: {
                        media,
                        description: reportDescription
                    },
                })
            }


            ToastAndroid.show("Laporan berhasil dikirim!", ToastAndroid.SHORT)
            setShowReportModal(false)
            setReportDescription("")
            setReportImages([])
        } catch (e) {

            ToastAndroid.show("Gagal mengirim laporan!", ToastAndroid.SHORT)
        } finally {
            setUploading(false)
        }
    }

    const unblockUser = async () => {
        try {
            await api({
                url: `/user/${public_id}/unblock`,
                method: "POST"
            })
            ToastAndroid.show("User berhasil di-unblock!", ToastAndroid.SHORT)
        } catch (err) {
            ToastAndroid.show("Gagal membuka blokir user!", ToastAndroid.SHORT)
        }
    }

    const detailProfile = async () => {
        setLoading(true)
        try {
            const profileData = await profileContactRequest(username)
            console.log(profileData, 'profileDataprofileData');

            setDetailDataProfile(profileData)

        } catch (error) {
            ToastAndroid.show("Gagal mengambil detail profile !", ToastAndroid.SHORT)
        } finally {
            setLoading(false)
        }
    }

    const detailGroup = async () => {
        setLoading(true)
        try {
            const profileGroup = await myGroupRequest(public_id)
            setDetailDataGrup(profileGroup.community)
        } catch (error) {
            ToastAndroid.show("Gagal mengambil detail group !", ToastAndroid.SHORT)
        } finally {
            setLoading(false)
        }
    }

    const memberGroup = async () => {
        try {
            const { data } = await memberCommunity(public_id)
            setMemberGroupList(data)
        } catch (error) {
            ToastAndroid.show("Gagal mengambil anggota group !", ToastAndroid.SHORT)
        }
    }

    const btnCreateGroup = () => {
        navigation.navigate("ChoseMemberGroup")
    }

    const btnCteateTopik = () => {
        navigation.navigate("CreateTopik" as never)
    }

    const leaveGroup = async (public_id = "") => {
        setLoadingLeave(true)
        try {
            await leaveGroupRequest(public_id)
            ToastAndroid.show("Berhasil keluar dari grup !", ToastAndroid.SHORT)

        } catch (error) {
            ToastAndroid.show("Gagal keluar dari grup !", ToastAndroid.SHORT)

        } finally {
            setLoadingLeave(false)
        }
    }

    const blockUser = async () => {
        try {
            console.log(public_id, 'public_idpublic_id');

            await api({
                url: `/user/${public_id}/block`,
                method: "POST"
            })
            ToastAndroid.show("User berhasil diblokir !", ToastAndroid.SHORT)
        } catch (err) {
            ToastAndroid.show("Gagal memblokir user !", ToastAndroid.SHORT)
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (isGroup) {
                detailGroup()
                memberGroup()
            } else {
                detailProfile()
            }
        }, [username, public_id, isGroup])
    )

    return (
        <View className="flex-1 bg-gray-100">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="bg-white p-4 mb-1">
                    <View className="items-center">
                        {
                            !isGroup ?
                                (Object.keys(detailDataProfile).length > 0 && detailDataProfile.user.profile_picture_url !== null) ?
                                    detailDataProfile.user.profile_picture_url !== null &&
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("PreviewMedia", {
                                            type: AttachmentType.IMAGE,
                                            name: `${detailDataProfile.name}.png`,
                                            url: detailDataProfile.user.profile_picture_url
                                        })}
                                        className="w-[102px] h-[102px] items-center justify-center border border-gray-200 rounded-full"
                                    >
                                        <Image resizeMode="cover" source={{ uri: detailDataProfile.user.profile_picture_url }} className="w-[100px] h-[100px] rounded-full" />
                                    </TouchableOpacity>
                                    :
                                    <Assets.ImageEmptyProfile width={100} height={100} />
                                :
                                detailDataGroup !== null ?
                                    detailDataGroup.logo !== null &&
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("PreviewMedia", {
                                            type: AttachmentType.IMAGE,
                                            name: `${detailDataGroup.name}.png`,
                                            url: detailDataGroup.logo
                                        })}
                                        className="w-[102px] h-[102px] items-center justify-center border border-gray-200 rounded-full"
                                    >
                                        <Image resizeMode="cover" source={{ uri: detailDataGroup.logo }} className="w-[100px] h-[100px] rounded-full" />
                                    </TouchableOpacity>
                                    :
                                    <Assets.ImageGroupEmptyProfile width={100} height={100} />

                        }
                    </View>
                    <View className="items-center pt-2">
                        {
                            loading ?
                                <View className="w-4/12 h-[20px] rounded-md bg-gray-100 animate-pulse"></View>
                                :
                                isGroup ?
                                    detailDataGroup !== null &&
                                    <Text className="font-satoshi text-lg font-medium text-black">{detailDataGroup.name}</Text>
                                    :
                                    Object.keys(detailDataProfile).length > 0 &&
                                    <>
                                        <Text className="font-satoshi text-lg font-medium text-black">{detailDataProfile.user.name}</Text>
                                        <Text className="font-satoshi font-medium text-Neutral/70 text-xs">( {detailDataProfile.user.username} )</Text>
                                    </>
                        }
                    </View>
                    <View className="items-center pt-2 pb-2">
                        <Text className="font-satoshi text-sm text-gray-500">Avaliable</Text>
                    </View>
                </View>

                <View className="bg-white p-4 my-1 flex-row">
                    <TouchableOpacity
                        className="w-4/12 p-1"
                        onPress={() => {
                            if (!isGroup) {

                            } else {
                                navigation.navigate("DetailChat", {
                                    public_hash: Object.keys(detailDataGroup).length > 0 && detailDataGroup.public_identifier,
                                    isComunity: isGroup,
                                    public_id: public_id
                                })
                            }
                        }}
                    >
                        <View className="bg-gray-100 rounded-xl h-[70px] justify-center items-center w-full">
                            <View>
                                <Assets.IconMessageBlack width={20} height={20} />
                            </View>
                            <View className="mt-1">
                                <Text className="font-satoshi text-xs text-black">
                                    Pesan
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        // onPress={() => navigation.navigate("MediaChat")} 
                        className="w-4/12 p-1">
                        <View className="bg-gray-100 rounded-xl h-[70px] justify-center items-center w-full">
                            <View>
                                <Assets.IconMediaBlack width={20} height={20} />
                            </View>
                            <View className="mt-1">
                                <Text className="font-satoshi text-xs text-black">
                                    Media
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity className="w-3/12 p-1" onPress={() => navigation.navigate("VoiceCall")}>
                        <View className="bg-gray-100 rounded-xl h-[70px] justify-center items-center w-full">
                            <View>
                                <Assets.IconCallBlack width={20} height={20} />
                            </View>
                            <View className="mt-1">
                                <Text className="font-satoshi text-xs text-black">
                                    Panggil
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        className="w-4/12 p-1"
                    // onPress={() => navigation.navigate("SearchChat")}
                    >
                        <View className="bg-gray-100 rounded-xl h-[70px] justify-center items-center w-full">
                            <View>
                                <Assets.IconSearch width={20} height={20} />
                            </View>
                            <View className="mt-1">
                                <Text className="font-satoshi text-xs text-black">
                                    Cari
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {
                    !isGroup &&
                    <TouchableOpacity className="bg-white p-4 my-1 flex-row items-center" onPress={() => navigation.navigate("PostProfile", {
                        username: username
                    })}>
                        <View className="w-2/12">
                            <Assets.IconFeedActive width={30} height={30} />
                        </View>
                        <View className="w-8/12">
                            <Text className="font-satoshi text-md font-medium text-black">Postingan Kabar</Text>
                        </View>
                        <View className="w-2/12 items-end">
                            <Assets.IconArrowRight width={25} height={25} />
                        </View>
                    </TouchableOpacity>
                }

                <View className="bg-white p-4 my-1">
                    <View className="mb-2">
                        {
                            isGroup ?
                                detailDataGroup !== null &&
                                <Text className="font-satoshi text-xs text-gray-600">{detailDataGroup.total_member} Anggota</Text>
                                :
                                <Text className="font-satoshi text-xs text-gray-600">1 grub yang sama</Text>
                        }
                    </View>

                    {
                        isGroup ?
                            detailDataGroup !== null &&
                            memberGroupList !== null &&
                            memberGroupList.length > 0 &&
                            memberGroupList.map((member, i) => (
                                <ContextMenu
                                    key={i}
                                    actions={[
                                        {
                                            title: "Lihat Profile Anggota"
                                        },
                                        {
                                            title: "Jadikan Admin Grup"
                                        },
                                        {
                                            title: "Hapus Anggota"
                                        },
                                    ]}
                                    onPress={async (e) => {
                                        if (e.nativeEvent.index === 0) {
                                            navigation.navigate("Profile", {
                                                username: member.otm_id_user.username,
                                                isGroup: false
                                            })
                                        }

                                        if (e.nativeEvent.index === 1) {
                                            try {
                                                await addToAdminGroupRequest(detailDataGroup.public_identifier, member.otm_id_user.public_hash)
                                                ToastAndroid.show("Berhasil menambahkan admin !", ToastAndroid.SHORT)

                                                if (isGroup) {
                                                    detailGroup()
                                                }

                                            } catch (error) {
                                                ToastAndroid.show("Gagal menambahkan ke admin !", ToastAndroid.SHORT)
                                            }
                                        }

                                        if (e.nativeEvent.index === 2) {
                                            try {
                                                await removeFromAdminGroupRequest(detailDataGroup.public_identifier, member.user.public_hash)
                                                ToastAndroid.show("Berhasil menghapus admin !", ToastAndroid.SHORT)

                                                if (isGroup) {
                                                    detailGroup()
                                                }

                                            } catch (error) {
                                                ToastAndroid.show("Gagal menghapus admin !", ToastAndroid.SHORT)
                                            }
                                        }
                                    }}
                                >
                                    <View className="py-2">
                                        <View className="flex-row items-center">
                                            <View className="w-2/12">
                                                {
                                                    member.otm_id_user.profile_picture_url !== null ?
                                                        <Image source={{ uri: member.otm_id_user.profile_picture_url }} width={45} height={45} className="rounded-full" />
                                                        :
                                                        <Assets.ImageEmptyProfile width={45} height={45} />
                                                }
                                            </View>
                                            <View className={`${member.is_admin ? "w-7/12" : "w-10/12"}`}>
                                                <View>
                                                    <Text className="font-satoshi text-sm font-medium text-black">{member.otm_id_user.name}</Text>
                                                </View>
                                            </View>
                                            {
                                                member.is_admin &&
                                                <View className="w-3/12">
                                                    <View className="bg-Primary/Main/10 items-center justify-center h-[25px] rounded-lg">
                                                        <Text className="font-satoshi font-bold text-[10px] text-Primary/Main">Admin Grup</Text>
                                                    </View>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </ContextMenu>
                            ))
                            :
                            <>
                                <View className="py-5">
                                    <View className="flex-row">
                                        <View className="w-2/12">
                                            <Assets.ImageGroupEmptyProfile width={45} height={45} />
                                        </View>
                                        <View className="w-10/12">
                                            <View>
                                                <Text className="font-satoshi text-sm font-medium text-black">Grub</Text>
                                            </View>
                                            <View className="mt-1">
                                                <Text className="font-satoshi text-xs text-gray-600">12 Anggota</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="w-6/12 pr-1">
                                        <Components.Button
                                            customIcon={<Assets.IconCreateTopic width={20} height={20} />}
                                            label="Buat Topik"
                                            customColor="bg-gray-100"
                                            customColorText="text-black"
                                            onPress={btnCteateTopik}
                                        />
                                    </View>
                                    <View className="w-6/12 pl-1">
                                        <Components.Button
                                            customIcon={<Assets.IconGroupRed width={20} height={20} />}
                                            label="Buat Grub"
                                            customColor="bg-Primary/Main/10"
                                            customColorText="text-Primary/Main"
                                            onPress={btnCreateGroup}
                                        />
                                    </View>
                                </View>
                            </>
                    }
                </View>

                {
                    !isGroup &&
                    <View className="bg-white p-4 my-1">
                        <TouchableOpacity
                            id="report-user"
                            onPress={() => setShowReportModal(true)}
                            className="py-2 flex-row items-center">
                            <View className="pr-3">
                                <Assets.IconReport width={20} height={20} />
                            </View>
                            <View>
                                <Text className="font-satoshi text-sm font-medium text-Primary/Main">Laporkan {detailDataProfile?.user?.name}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            id="block-user"
                            onPress={() => {
                                setBlockMode(detailDataProfile?.is_blocked ? "unblock" : "block")
                                setShowBlockModal(true)
                            }}
                            className="py-2 flex-row items-center">
                            <View className="pr-3">
                                <Assets.IconBlock width={20} height={20} />
                            </View>
                            <Text className="font-satoshi text-sm font-medium text-Primary/Main">
                                {detailDataProfile?.is_blocked ? "Buka Blokir" : "Blokir"}
                            </Text>
                        </TouchableOpacity>


                    </View>
                }

                {
                    isGroup &&
                    <>
                        <View className="bg-white p-4 my-1">
                            <TouchableOpacity id="report-group" className="py-2 flex-row items-center"
                                onPress={() => setShowReportModal(true)}>
                                <View className="pr-3">
                                    <Assets.IconReportBlack width={20} height={20} />
                                </View>
                                <View>
                                    <Text className="font-satoshi text-sm font-medium text-Neutral/90">Laporkan {detailDataGroup?.name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-white p-4 my-1">
                            <TouchableOpacity onPress={() => leaveGroup(detailDataGroup?.public_identifier)} className="py-2 flex-row items-center">
                                <View className="pr-3">
                                    <Assets.IconLogout width={20} height={20} />
                                </View>
                                <Text className="font-satoshi text-sm font-medium text-Primary/Main">Keluar Grup</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Modal Report */}
                    </>
                }
                <Modal
                    id="modal-report"
                    visible={showReportModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowReportModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowReportModal(false)}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.3)",
                            justifyContent: "flex-end"
                        }}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : undefined}
                                style={{ width: "100%" }}
                            >
                                <View style={{
                                    backgroundColor: "white",
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 20,
                                    minHeight: 320
                                }}>
                                    <Text className="font-bold text-lg mb-2">Laporkan Grup</Text>
                                    <TextInput
                                        placeholder="Deskripsi laporan"
                                        value={reportDescription}
                                        onChangeText={setReportDescription}
                                        multiline
                                        style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 8, padding: 8, marginBottom: 10, minHeight: 60 }}
                                    />
                                    <ScrollView horizontal>
                                        {reportImages.map((img, idx) => (
                                            <Image key={idx} source={{ uri: img.uri }} style={{ width: 60, height: 60, marginRight: 8, borderRadius: 8 }} />
                                        ))}
                                        <TouchableOpacity onPress={openImagePicker} style={{ width: 60, height: 60, backgroundColor: "#eee", justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                                            <Text>+</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                    <View className="flex-row mt-4">
                                        <TouchableOpacity
                                            onPress={() => setShowReportModal(false)}
                                            style={{ flex: 1, marginRight: 8, padding: 10, backgroundColor: "#eee", borderRadius: 8, alignItems: "center" }}>
                                            <Text>Batal</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={submitReport}
                                            disabled={uploading}
                                            style={{ flex: 1, padding: 10, backgroundColor: "#f00", borderRadius: 8, alignItems: "center" }}>
                                            <Text style={{ color: "#fff" }}>{uploading ? "Mengirim..." : "Kirim"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <Modal
                    id="modal-block-user"
                    visible={showBlockModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowBlockModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowBlockModal(false)}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.3)",
                            justifyContent: "flex-end"
                        }}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : undefined}
                                style={{ width: "100%" }}
                            >
                                <View style={{
                                    backgroundColor: "white",
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 24,
                                    minHeight: 200,
                                    alignItems: "center"
                                }}>
                                    <Text className="font-bold text-lg mb-2">
                                        {blockMode === "block" ? "Blokir Pengguna" : "Buka Blokir Pengguna"}
                                    </Text>
                                    <Text className="text-center mb-4">
                                        {blockMode === "block"
                                            ? `Apakah Anda yakin ingin memblokir ${detailDataProfile?.user?.name}?`
                                            : `Apakah Anda yakin ingin membuka blokir ${detailDataProfile?.user?.name}?`
                                        }
                                    </Text>
                                    <View style={{ flexDirection: "row", width: "100%" }}>
                                        <TouchableOpacity
                                            onPress={() => setShowBlockModal(false)}
                                            style={{ flex: 1, marginRight: 8, padding: 10, backgroundColor: "#eee", borderRadius: 8, alignItems: "center" }}>
                                            <Text>Batal</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                setShowBlockModal(false)
                                                if (blockMode === "block") {
                                                    await blockUser()
                                                } else {
                                                    await unblockUser()
                                                }
                                            }}
                                            style={{ flex: 1, padding: 10, backgroundColor: "#f00", borderRadius: 8, alignItems: "center" }}>
                                            <Text style={{ color: "#fff" }}>
                                                {blockMode === "block" ? "Blokir" : "Buka Blokir"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </ScrollView>
        </View>
    )
}

export default Profile