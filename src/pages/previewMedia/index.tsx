import { AttachmentType } from "@pn/watch-is/model"
import { FC } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import AutoHeightImage from "react-native-auto-height-image"
import VideoPlayer from 'react-native-video-controls';
import Components from "../../components";
import Assets from "../../assets";
import { downloadWithCheckPermissioin } from "../../helpers/downloadFile";

interface PreviewMediaInterface {
    navigation : any,
    route : any
}

const PreviewMedia:FC<PreviewMediaInterface> = ({ navigation, route }) => {
    const { type, url, name } = route.params
    const width         = Dimensions.get("screen").width
    const height        = Dimensions.get("screen").height

    return (
        <View className="flex-1 bg-black items-center justify-center">
            {
                type === AttachmentType.IMAGE &&
                <AutoHeightImage
                    width={width}
                    source={{ uri: url }}
                />
            }

            {
                type === AttachmentType.VIDEO &&
                <VideoPlayer
                    navigator={navigation}
                    source={{ uri: url }}
                    width={width}
                    height={height}
                    resizeMode="contain"
                    useNativeDriver={true}
                    disableBack
                />
            }

            {/* modals */}
            <Components.ModalsCustomRight>
                <TouchableOpacity onPress={() => downloadWithCheckPermissioin(name, url)} className="flex-row items-center">
                    <View>
                        <Assets.IconArrowDown width={15} height={15}/>
                    </View>
                    <View className="pl-3">
                        <Text className="font-satoshi text-black font-medium">Download</Text>
                    </View>
                </TouchableOpacity>
            </Components.ModalsCustomRight>
        </View>
    )
}

export default PreviewMedia