import { View, Text, TouchableOpacity, Platform, ToastAndroid } from "react-native"
import { FC, Fragment, useEffect, useState } from "react"
import ContainerModalsBottom from "../../modalsContainerBottom"
import Button from "../../button"
import Assets from "../../../assets"
import ImagePicker from 'react-native-image-crop-picker';
import FormInput from "../../formInput"
import { uploadFile } from "../../../helpers/uploadFile"
import ModalsChoseImageFrom from "../modalsSelectImages"
import Video from "react-native-video"

interface ModalsPostVideoInterface {
    isShow: boolean,
    handleClose: (value: boolean) => void
    onPost: (videoUrl: string, desc: string) => void,
    loading: boolean
}

const ModalsPostVideo: FC<ModalsPostVideoInterface> = ({ isShow, handleClose, onPost, loading }) => {
    const [selectedVideo, setSelectedVideo] = useState({ path: "", mime: "" })
    const [descVideo, setDescVideo] = useState("")
    const [showModalsSelectImage, setShowSelectImage] = useState(false)
    const [loadingPost, setLoadingPost] = useState(loading)

    const handleShowHideModals = () => {
        handleClose(false)
    }

    const uploadVideo = async (video: { path: string, mime: string }) => {
        try {
            const { data } = await uploadFile(video.path, 'video/mp4');
            return data
        } catch (error) {
            ToastAndroid.show("Gagal melakukan upload !", ToastAndroid.SHORT)
            return "";
        }
    }

    const choseImageCamera = async () => {
        ImagePicker.openCamera({
            mediaType: "video"
        }).then((image: any) => {
            setShowSelectImage(false)
            setSelectedVideo({
                path: image.path,
                mime: image.mime
            })

        }).catch((error: any) => {
            ToastAndroid.show("Batal mengambil video !", ToastAndroid.SHORT)
        });
    }

    const choseImageExplorer = async () => {
        ImagePicker.openPicker({
            mediaType: "video"
        }).then((image: any) => {
            setShowSelectImage(false)
            setSelectedVideo({
                path: image.path,
                mime: image.mime
            })

        }).catch((error: any) => {
            console.log("select image canceled !");
        });
    }

    const postVideo = async () => {
        setLoadingPost(true)
        try {
            if (selectedVideo.path !== "") {
                const urlVideo = await uploadVideo(selectedVideo)

                if (urlVideo) {
                    onPost(urlVideo, descVideo)
                } else {
                    ToastAndroid.show("Gagal upload video!", ToastAndroid.SHORT)
                }
            } else {
                ToastAndroid.show("Video tidak boleh kosong !", ToastAndroid.SHORT)
            }
        } catch (error) {
            ToastAndroid.show("Gagal melakukan upload video !", ToastAndroid.SHORT)
        } finally {
            setLoadingPost(false)
        }
    }

    useEffect(() => {
        if (!isShow) {
            setDescVideo("")
            setSelectedVideo({ path: "", mime: "" })
        }

        setLoadingPost(loading)
        return () => {
            setDescVideo("")
            setSelectedVideo({ path: "", mime: "" })
        }
    }, [isShow, loading])

    return (
        <ContainerModalsBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
            <View className="px-2 pt-4 pb-1">
                <View>
                    {
                        selectedVideo.path !== "" ?
                            <Fragment>
                                <TouchableOpacity onPress={() => setShowSelectImage(true)}>
                                    <Video
                                        paused={true}
                                        source={{ uri: selectedVideo.path }}
                                        resizeMode="contain"
                                        style={{
                                            height: 120
                                        }}
                                    />
                                </TouchableOpacity>

                                <View className="mt-4">
                                    <FormInput
                                        placeholder="Masukan deskripsi video..."
                                        onChange={setDescVideo}
                                        value={descVideo}
                                    />
                                </View>
                            </Fragment>
                            :
                            <TouchableOpacity onPress={() => setShowSelectImage(true)} className="border border-dashed border-gray-400 p-4 h-[120px] items-center justify-center flex-1">
                                <View className="items-center">
                                    <Assets.IconCamera width={40} height={40} />
                                </View>
                                <View className="items-center justify-center mt-2">
                                    <Text className="font-satoshi text-black font-medium text-xs">Pilih Video</Text>
                                </View>
                            </TouchableOpacity>
                    }
                </View>
                <View className="mt-5">
                    <Button
                        loading={loadingPost}
                        label="Posting"
                        onPress={postVideo}
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
        </ContainerModalsBottom>
    )
}

export default ModalsPostVideo