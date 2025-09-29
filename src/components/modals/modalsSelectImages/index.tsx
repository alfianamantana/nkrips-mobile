import { View, Text, TouchableOpacity } from "react-native"
import { FC } from "react"
import ContainerModalsBottom from "../../modalsContainerBottom"
import Button from "../../button"
import Assets from "../../../assets"

interface ChoseImageFromInterface {
    isShow           : boolean,
    handleClose      : (value:boolean) => void,
    fromCamera       : () => void,
    fromFileExplorer : () => void
}

const ModalsChoseImageFrom:FC<ChoseImageFromInterface> = ({ isShow, handleClose, fromCamera, fromFileExplorer }) => {
    
    const handleShowHideModals = () => {
        handleClose(false)
    }
    
    return (
        <ContainerModalsBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
            <View className="px-2 pt-4 pb-1">
                <View className="flex-row">
                    <View className="flex-1">
                        <TouchableOpacity className="items-center justify-center" onPress={() => fromFileExplorer()}>
                            <View className="items-center justify-center">
                                <Assets.IconGallery width={40} height={40}/>
                            </View>
                            <View className="items-center justify-center mt-1">
                                <Text className="font-satoshi text-black font-medium">Galleri</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1">
                        <TouchableOpacity className="items-center justify-center" onPress={() => fromCamera()}>
                            <View className="items-center justify-center">
                                <Assets.IconCamera width={40} height={40}/>
                            </View>
                            <View className="items-center justify-center mt-1">
                                <Text className="font-satoshi text-black font-medium">Kamera</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="mt-5">
                    <Button
                        label="Batal pilih foto"
                        onPress={handleShowHideModals}
                    />
                </View>
            </View>
        </ContainerModalsBottom>
    )
}

export default ModalsChoseImageFrom