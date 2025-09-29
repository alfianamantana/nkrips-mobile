import { FC } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from "react-native-modal";

interface ContainerModalsInterface {
    isShow          : boolean,
    handleClose     : (value:boolean) => void,
    children        : any,
    isRoundedLarge? : boolean,
    isFullWidth?    : boolean,
    isBottom?         : boolean,
    isRemovePadding? : boolean,
    backdropPress? : boolean
}

const deviceHeight = Dimensions.get("window").height
const deviceWidth  = Dimensions.get("window").width

const ContainerModals:FC<ContainerModalsInterface> = ({ isShow=false, handleClose, children}) => {
    return (
        <Modal 
            isVisible={isShow} 
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            backdropOpacity={0} 
            swipeThreshold={100}
            animationInTiming={500}
            animationOutTiming={500}
            onBackdropPress={() => handleClose(false)}
            onSwipeComplete={() => handleClose(false)}
            swipeDirection="up"
            hasBackdrop={true}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            style={{ padding:0, margin:0,  position:"relative" }}
        >
            <View className="absolute top-0 right-0">
                {children}
            </View>
        </Modal>
    )
}

export default ContainerModals