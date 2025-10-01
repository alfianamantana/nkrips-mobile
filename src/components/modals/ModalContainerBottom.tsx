import { FC } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from "react-native-modal";

interface ContainerModalsInterface {
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

const ContainerModalsBottom: FC<ContainerModalsInterface> = ({ isShow = false, handleClose, children, isRoundedLarge = false, isFullWidth = false, isBottom = false, isRemovePadding = false, backdropPress = true }) => {
  return (
    // <GestureHandlerRootView>
    <Modal
      isVisible={isShow}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      backdropOpacity={0.5}
      swipeThreshold={100}
      animationInTiming={500}
      animationOutTiming={500}
      onBackdropPress={() => backdropPress ? handleClose(false) : null}
      onSwipeComplete={() => handleClose(false)}
      swipeDirection="down"
      hasBackdrop={true}
      animationIn={"slideInUp"}
      style={{ padding: 0, margin: 0, position: "relative" }}
    >
      <View className={`w-full items-center ${isBottom ? "absolute bottom-0" : "justify-center"}`}>
        <View className={`bg-white ${isFullWidth ? "w-full" : "w-10/12"} ${isRemovePadding ? "p-0" : "p-4"} ${isRoundedLarge ? "rounded-[30px]" : isFullWidth ? `rounded-t-[20px]` : "rounded-xl"}`}>
          {
            isBottom &&
            <View className="items-center mb-3 mt-1">
              <View className="bg-gray-200 rounded-full h-[7px] w-2/12"></View>
            </View>
          }

          {children}
        </View>
      </View>
    </Modal>
    // </GestureHandlerRootView>
  )
}

export default ContainerModalsBottom