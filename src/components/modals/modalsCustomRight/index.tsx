import { View } from "react-native"
import ContainerModals from "../../modalsContainer"
import { FC, ReactNode } from "react"
import { storeShowCustomRight } from "../../../store"

interface ModalsCustomRightInterface {
    children : ReactNode,
}

const ModalsCustomRight:FC<ModalsCustomRightInterface> = ({ children }) => {
    const { showCustomRight, setShowCustomRight } = storeShowCustomRight()
    
    return (
        <ContainerModals isShow={showCustomRight} handleClose={setShowCustomRight}>
            <View className="right-2 top-[65px] w-full bg-white rounded-md p-4 border border-gray-100">
                {children}
            </View>
        </ContainerModals>
    )
}

export default ModalsCustomRight