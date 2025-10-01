import { FC } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from "react-native-modal";

interface SideBarContainerInterface {
    isShow: boolean,
    handleClose: (value: boolean) => void,
    children: any,
    isRoundedLarge?: boolean,
    isFullWidth?: boolean,
    isBottom?: boolean,
    isRemovePadding?: boolean,
    backdropPress?: boolean
}

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const SideBarContainer: FC<SideBarContainerInterface> = ({ isShow = false, handleClose, children }) => {
    return (
        <Modal
            isVisible={isShow}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            backdropOpacity={0.3}
            swipeThreshold={100}
            animationInTiming={500}
            animationOutTiming={500}
            onBackdropPress={() => handleClose(false)}
            onSwipeComplete={() => handleClose(false)}
            swipeDirection="left"
            hasBackdrop={true}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            style={{ padding: 0, margin: 0, position: "relative" }}
        >
            <View className="absolute top-0 left-0">
                {children}
            </View>
        </Modal>
    )
}

export default SideBarContainer