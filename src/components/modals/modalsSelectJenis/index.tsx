import { FC, useState } from "react"
import ContainerModalsBottom from "../../modalsContainerBottom"
import { Text, TouchableOpacity, View, ScrollView } from "react-native"
import RadioButton from "../../radioButton"
import Button from "../../button"

interface ModalSelectJenisInterface {
    isShow : boolean,
    handleShowHideModals : () => void,
    handleSelected : (value:number, label:string) => void
}

const ModalsSelectJenis:FC<ModalSelectJenisInterface> = ({ isShow, handleShowHideModals, handleSelected}) => {
    const [activeData, setActiveData] = useState({ value: 0, label: "" })
    const listData = [
        {
            label : "Baru",
            value : 0
        },
        {
            label : "Bekas",
            value : 1
        }
    ]

    return (
        <ContainerModalsBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
            <View>
                <View className="flex-1">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            listData.length > 0 &&
                            listData.map((e, i) => (
                                <TouchableOpacity key={i} onPress={() => setActiveData({ value:e.value, label:e.label })} className="flex-row items-center my-2">
                                    <View>
                                        <RadioButton
                                            isChecked={activeData.value === e.value ? true : false}
                                        />
                                    </View>
                                    <View className="flex-1 pl-2">
                                        <Text className="font-satoshi text-Neutral/90">{e.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
                <View className="bg-white pt-3">
                    <Button
                        label="Terapkan"
                        onPress={() => {
                            handleSelected(activeData.value, activeData.label)
                        }}
                    />
                </View>
            </View>
        </ContainerModalsBottom>
    )
}

export default ModalsSelectJenis