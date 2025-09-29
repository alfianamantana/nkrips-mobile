import { Image, ToastAndroid, View, TouchableOpacity, Platform } from "react-native"
import ImagePicker from 'react-native-image-crop-picker';
import Components from "../../../../components"
import Assets from "../../../../assets"
import { FC, useState } from "react"
import { createUsernameRequest } from "../../../../services/auth/register"
import { uploadFile } from "../../../../helpers/uploadFile";

interface CreateUsernameInterface {
    navigation : any
}

const CreateUsername:FC<CreateUsernameInterface> = ({ navigation }) => {
    const [username, setUsername]                     = useState("")
    const [imageProfile, setImageProfile]             = useState({ path:"", base64:"" })
    const [imageUrlUploaded, setImageUrlUploaded]     = useState("")
    const [loading, setLoading]                       = useState(false)
    const [showModalsSelectImage, setShowSelectImage] = useState(false)

    const btnPress = async () => {
        setLoading(true)
        try {
            await createUsernameRequest(username, imageUrlUploaded)
            navigation.navigate("InputDataRegister")
            
        } catch (error) {
            ToastAndroid.show("Gagal membuat username !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    const uploadImage = async (image:any) => {
        try {
            const formData = new FormData()
            formData.append("file", {
                name : image.path.split("/").slice(-1)[0],
                type : image.mime,
                uri  : Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
            })

            const postImg = await uploadFile("/upload", formData)
            setImageUrlUploaded(postImg.data)

        } catch (error) {        
            ToastAndroid.show("Gagal melakukan upload !", ToastAndroid.SHORT)

        }
    }

    const choseImageCamera = async () => {
        ImagePicker.openCamera({
            width                : 500,
            height               : 500,
            cropping             : true,
            includeBase64        : true,
            freeStyleCropEnabled : true,
            mediaType            : 'photo'
        }).then((image:any) => {
            setImageProfile({
                path   : image.path,
                base64 : `data:${image.mime};base64,${image.data}`
            })

            setShowSelectImage(false)
            uploadImage(image)

        }).catch((error:any) => {
            console.log("select image canceled !");
        });
    }

    const choseImageExplorer = async () => {
        ImagePicker.openPicker({
            width                : 500,
            height               : 500,
            cropping             : true,
            includeBase64        : true,
        }).then((image:any) => {
            
            setImageProfile({
                path   : image.path,
                base64 : `data:${image.mime};base64,${image.data}`
            })

            setShowSelectImage(false)
            uploadImage(image)

        }).catch((error:any) => {
            console.log("select image canceled !");
        });
    }

    return (
        <View className="flex-1 bg-white p-4">
            <View>
                <TouchableOpacity onPress={() => setShowSelectImage(true)}>
                    <View className="justify-center items-center w-full">
                        {
                            imageProfile.path !== "" ?
                                <Image source={{ uri: imageProfile.path }} width={120} height={120} className="rounded-full"/>
                            :
                                <Assets.ImageInsert width={120} height={120}/>
                        }
                    </View>
                </TouchableOpacity>

                <View className="my-5">
                    <Components.FormInput
                        label="Username"
                        placeholder="Masukan username"
                        value={username}
                        onChange={setUsername}
                    />
                </View>
            </View>
            <View className="flex-1 justify-end">
                <Components.Button
                    label="Lanjutkan"
                    onPress={btnPress}
                    isDisabled={username !== "" ? false : true}
                    loading={loading}
                />
            </View>
            
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

export default CreateUsername