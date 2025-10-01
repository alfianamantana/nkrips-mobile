import { View, Text, TouchableOpacity, Image, Platform, ToastAndroid } from "react-native"
import { FC, Fragment, useEffect, useState } from "react"
import Button from "../../button"
import Assets from "../../../assets"
import ImagePicker from 'react-native-image-crop-picker';
import FormInput from "../../formInput"
import { uploadFile } from "../../../helpers/uploadFile"
import ModalsChoseImageFrom from "../modalsSelectImages"
import Components from "../.."

interface ModalsPostPhotoInterface {
    isShow: boolean,
    handleClose: (value: boolean) => void
    onPost: (image: string, desc: string) => void,
    loading: boolean
}

const ModalsPostPhoto: FC<ModalsPostPhotoInterface> = ({ isShow, handleClose, onPost, loading }) => {
    const [selectedImage, setSelectedImage] = useState({ path: "", mime: "" })
    const [descPhoto, setDescPhoto] = useState("")
    const [showModalsSelectImage, setShowSelectImage] = useState(false)
    const [loadingPost, setLoadingPost] = useState(loading)

    const handleShowHideModals = () => {
        handleClose(false)
    }

    const uploadImage = async (image: { path: string, mime: string }) => {
        try {
            const { data } = await uploadFile(image.path, image.mime);
            return data; // langsung return url string
        } catch (error) {
            ToastAndroid.show("Gagal melakukan upload !", ToastAndroid.SHORT)
            return "";
        }
    }

    const choseImageCamera = async () => {
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
            freeStyleCropEnabled: true,
            mediaType: 'photo'
        }).then((image: any) => {
            setShowSelectImage(false)
            setSelectedImage({
                path: image.path,
                mime: image.mime
            })

        }).catch((error: any) => {
            ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
        });
    }

    const choseImageExplorer = async () => {
        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
        }).then((image: any) => {
            setShowSelectImage(false)
            setSelectedImage({
                path: image.path,
                mime: image.mime
            })

        }).catch((error: any) => {
            ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
        });
    }

    const postImage = async () => {
        setLoadingPost(true)
        try {
            if (selectedImage.path !== "") {
                const urlImage = await uploadImage(selectedImage)
                if (urlImage) {
                    onPost(urlImage, descPhoto)
                } else {
                    ToastAndroid.show("Gagal upload foto!", ToastAndroid.SHORT)
                }
            } else {
                ToastAndroid.show("Foto tidak boleh kosong !", ToastAndroid.SHORT)
            }
        } catch (error) {
            ToastAndroid.show("Gagal melakukan upload foto !", ToastAndroid.SHORT)
        } finally {
            setLoadingPost(false)
        }
    }

    useEffect(() => {
        setLoadingPost(loading)
        return () => {
            setDescPhoto("")
            setSelectedImage({ path: "", mime: "" })
        }
    }, [loading])

    return (
        <Components.ModalContainerBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
            <View className="px-2 pt-4 pb-1">
                <View>
                    {
                        selectedImage.path !== "" ?
                            <Fragment>
                                <TouchableOpacity onPress={() => choseImageExplorer()}>
                                    <Image
                                        source={{ uri: selectedImage.path }}
                                        resizeMode="contain"
                                        className="h-[200px]"
                                    />
                                </TouchableOpacity>

                                <View className="mt-4">
                                    <FormInput
                                        placeholder="Masukan deskripsi gambar..."
                                        onChange={setDescPhoto}
                                        value={descPhoto}
                                    />
                                </View>
                            </Fragment>
                            :
                            <TouchableOpacity onPress={() => setShowSelectImage(true)} className="border border-dashed border-gray-400 p-4 h-[120px] items-center justify-center flex-1">
                                <View className="items-center">
                                    <Assets.IconGallery width={40} height={40} />
                                </View>
                                <View className="items-center justify-center mt-2">
                                    <Text className="font-satoshi text-black font-medium text-xs">Pilih Gambar</Text>
                                </View>
                            </TouchableOpacity>
                    }
                </View>
                <View className="mt-5">
                    <Button
                        loading={loading}
                        label="Posting"
                        onPress={postImage}
                    />
                </View>
            </View>

            {
                showModalsSelectImage &&
                <ModalsChoseImageFrom
                    isShow={showModalsSelectImage}
                    handleClose={() => {
                        setShowSelectImage(false)
                    }}
                    fromCamera={choseImageCamera}
                    fromFileExplorer={choseImageExplorer}
                />
            }
        </Components.ModalContainerBottom>
    )
}

export default ModalsPostPhoto