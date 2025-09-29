import { FC, useEffect, useState } from "react"
import ContainerModalsBottom from "../../modalsContainerBottom"
import { Text, TouchableOpacity, View, ScrollView, ToastAndroid } from "react-native"
import RadioButton from "../../radioButton"
import Button from "../../button"
import { api } from "../../../services/api"

interface ModalSelectCategoryInterface {
    isShow: boolean,
    handleShowHideModals: () => void,
    handleSelected: (value: number, label: string) => void
}

const ModalsSelectCategory: FC<ModalSelectCategoryInterface> = ({ isShow, handleShowHideModals, handleSelected }) => {
    const [activeData, setActiveData] = useState({ value: 0, label: "" })
    const [listData, setListData] = useState<Array<{ value: number, label: string }>>([])

    const getCategoryProduct = async () => {
        try {
            const { data } = await api({
                url: `/product-category`,
            })
            let dataCategory = data.map((item: any) => ({
                value: item.id,
                label: item.label
            }))

            setListData(dataCategory)
        } catch (error) {
            ToastAndroid.show("Gagal memuat data kategori", ToastAndroid.LONG)
        }
    }

    useEffect(() => {
        getCategoryProduct()
    }, [isShow])

    return (
        <ContainerModalsBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
            <View>
                <View className="flex-1">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            listData.length > 0 &&
                            listData.map((e, i) => (
                                <TouchableOpacity key={i} onPress={() => setActiveData({ value: e.value, label: e.label })} className="flex-row items-center my-2">
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

export default ModalsSelectCategory