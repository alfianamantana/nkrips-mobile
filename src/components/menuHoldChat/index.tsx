import { View, TouchableOpacity, Text } from "react-native"
import Assets from "../../assets"
import ContainerModals from "../modalsContainer"
import { storeShowMenuChatHold } from "../../store"
import { useNavigation } from "@react-navigation/native"
import { postPinMessageRequest } from "../../services/home/chat"

const MenuHoldChat = ({ selectedMessage, public_hash, onAfterUnpin, onUnpin }) => {
    const navigation = useNavigation()
    const { showMenuChatHold, setShowMenuChatHold } = storeShowMenuChatHold()

    const isPinned = selectedMessage?.message?.is_pinned ?? selectedMessage?.is_pinned ?? false;

    return (
        <ContainerModals isShow={showMenuChatHold} handleClose={setShowMenuChatHold}>
            <View className="right-2 top-[65px] w-full bg-white rounded-md p-4 border border-gray-100">
                <TouchableOpacity
                    className="flex-row items-center my-2"
                    onPress={async () => {
                        if (isPinned) {
                            if (typeof onUnpin === "function") {
                                await onUnpin(selectedMessage.message.id);
                            }
                            setShowMenuChatHold(false);
                            if (onAfterUnpin) onAfterUnpin();
                        } else {
                            // Pin: trigger modal pin
                            if (selectedMessage.onPressPin) selectedMessage.onPressPin(selectedMessage);
                            setShowMenuChatHold(false);
                        }
                    }}
                >
                    <View className="pr-3">
                        <Assets.IconCopyBlack width={20} height={20} />
                    </View>
                    <View>
                        <Text className="font-satoshi text-black font-medium text-xs">
                            {isPinned ? "Unpin" : "Pin"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center my-2">
                    <View className="pr-3">
                        <Assets.IconCopyBlack width={20} height={20} />
                    </View>
                    <View>
                        <Text className="font-satoshi text-black font-medium text-xs">
                            Salins
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center my-2">
                    <View className="pr-3">
                        <Assets.IconReply width={20} height={20} />
                    </View>
                    <View>
                        <Text className="font-satoshi text-black font-medium text-xs">
                            Balas
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center my-2">
                    <View className="pr-3">
                        <Assets.IconTrashBlack width={20} height={20} />
                    </View>
                    <View>
                        <Text className="font-satoshi text-black font-medium text-xs">
                            Hapus
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ContainerModals>
    )
}

export default MenuHoldChat