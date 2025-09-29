import { useFocusEffect } from "@react-navigation/native"
import { FC, useCallback, useState } from "react"
import { Image, Platform, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { editProfileRequest, profileContactRequest } from "../../../../../services/home/profile"
import { User } from "@pn/watch-is/model"
import Button from "../../../../../components/button"
import Components from "../../../../../components"
import Assets from "../../../../../assets"
import moment from "moment-timezone"
import ImagePicker from 'react-native-image-crop-picker';
import { uploadFile } from "../../../../../helpers/uploadFile"

interface editProfileInterface {
    navigation: any,
    route: any
}

const EditProfile: FC<editProfileInterface> = ({ navigation, route }) => {
    const { username } = route.params
    const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false)
    const [showSelectDate, setShowSelectDate] = useState(false)
    const [usernameText, setUsernameText] = useState("")
    const [namaLengkap, setNamaLengkap] = useState("")
    const [email, setEmail] = useState("")
    const [tanggaLahir, setTanggaLahir] = useState("")
    const [urlProfile, setUrlProfile] = useState("")
    const [bio, setBio] = useState("")
    const [showModalsSelectImage, setShowSelectImage] = useState(false)

    const detailProfile = async () => {
        try {
            const profile = await profileContactRequest(username)
            setEmail(profile.email)
            setNamaLengkap(profile.name)
            setUsernameText(profile.username!)
            setTanggaLahir(profile.date_of_birth)
            setUrlProfile(profile.profile_picture_url ? profile.profile_picture_url : "")

        } catch (error) {
            ToastAndroid.show("Gagal mengambil data profile !", ToastAndroid.SHORT)

        }
    }

    const updateData = async () => {
        setLoadingUpdateProfile(true)
        try {
            await editProfileRequest({
                profile_picture_url: urlProfile,
                fullname: namaLengkap,
                email: email,
                tanggal_lahir: tanggaLahir
            })

            ToastAndroid.show("Berhasil perbarui data profile !", ToastAndroid.SHORT)
            navigation.goBack()

        } catch (error) {
            ToastAndroid.show("Gagal perbarui data profile !", ToastAndroid.SHORT)

        } finally {
            setLoadingUpdateProfile(false)
        }
    }

    const handleSelectedBirthday = (e: DateTimePickerEvent, data: Date | undefined) => {
        setShowSelectDate(false)
        setTanggaLahir(moment(data).startOf("day").format("DD MMM YYYY"))
    }

    const uploadImage = async (image: any) => {
        try {
            const formData = new FormData()
            formData.append("file", {
                name: image.path.split("/").slice(-1)[0],
                type: image.mime,
                uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
            })

            const postImg = await uploadFile("/upload", formData)
            setUrlProfile(postImg.data)

        } catch (error) {
            ToastAndroid.show("Gagal melakukan upload !", ToastAndroid.SHORT)

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
            setShowSelectImage(false)
            uploadImage(image)

        }).catch((error: any) => {
            ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
        });
    }

    const choseImageExplorer = async () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            includeBase64: true,
        }).then((image: any) => {
            setShowSelectImage(false)
            uploadImage(image)

        }).catch((error: any) => {
            ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
        });
    }

    useFocusEffect(
        useCallback(() => {
            detailProfile()
        }, [])
    )

    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex mb-5">
                        <View className="flex items-center">
                            <TouchableOpacity onPress={() => setShowSelectImage(true)} className="items-center justify-center w-[130px] h-[130px] rounded-full relative">
                                {
                                    urlProfile !== "" ?
                                        <Image source={{ uri: urlProfile }} className="rounded-full" width={130} height={130} />
                                        :
                                        <Assets.ImageEmptyProfile width={130} height={130} />
                                }

                                <View className="w-[25px] h-[25px] rounded-full bg-Primary/Main items-center justify-center absolute bottom-1 right-3">
                                    <Assets.IconEditWhite width={10} height={10} />
                                </View>
                            </TouchableOpacity>

                            <View className="flex mt-1">
                                <Components.FormInput
                                    maxLength={30}
                                    label="Bio"
                                    value={bio}
                                    onChange={setBio}
                                    placeholder="Masukan bio"
                                />
                                <View className="items-end mt-2">
                                    <Text className="font-satoshi text-xs">{bio.length}/30</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View className="flex my-2">
                            <Components.FormInput
                                label="Username"
                                value={usernameText}
                                onChange={setUsernameText}
                                placeholder="Masukan username"
                            />
                        </View>
                        <View className="flex my-2">
                            <Components.FormInput
                                label="Nama Lengkap"
                                value={namaLengkap}
                                onChange={setNamaLengkap}
                                placeholder="Masukan nama lengkap"
                            />
                        </View>
                        <View className="flex my-2">
                            <Components.FormInput
                                onPres={() => {
                                    setShowSelectDate(true)
                                }}
                                label="Tanggal Lahir"
                                value={tanggaLahir}
                                onChange={setTanggaLahir}
                                placeholder="Pilih tanggal"
                                sufix={
                                    <View>
                                        <Assets.IconCalender width={20} height={20} />
                                    </View>
                                }
                            />
                        </View>
                        <View className="flex my-2">
                            <Components.FormInput
                                label="Email"
                                value={email}
                                onChange={setEmail}
                                placeholder="Masukan email"
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View className="w-full py-3">
                <Button
                    label="Simpan"
                    onPress={updateData}
                    loading={loadingUpdateProfile}
                />
            </View>

            {
                showSelectDate &&
                <DateTimePicker
                    testID="dateTimePickerBirthday"
                    value={new Date()}
                    maximumDate={new Date()}
                    mode={"date"}
                    is24Hour={true}
                    onChange={handleSelectedBirthday}
                />
            }

            {
                showModalsSelectImage &&
                <Components.ModalsChoseImageFrom
                    isShow={showModalsSelectImage}
                    handleClose={() => {
                        setShowSelectImage(false)
                    }}
                    fromCamera={choseImageCamera}
                    fromFileExplorer={choseImageExplorer}
                />
            }
        </View>
    )
}

export default EditProfile