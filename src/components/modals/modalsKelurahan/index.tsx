import { FC, useEffect, useState } from "react"
import ContainerModalsBottom from "../../modalsContainerBottom"
import { Text, TouchableOpacity, View, ScrollView, ToastAndroid } from "react-native"
import RadioButton from "../../radioButton"
import Button from "../../button"
import { kelRequest } from "../../../services/adm"
import { Schema } from "@pn/watch-is/driver"
import FormInput from "../../formInput"
import LoadMore from "../../loadMore"

interface ModalsKelurahanInterface {
    isShow : boolean,
    handleShowHideModals : () => void,
    handleSelected : (value:number, label:string) => void,
    idProvinsi  : number,
    idKabupaten : number,
    idKecamatan : number
}

const ModalsKelurahan:FC<ModalsKelurahanInterface> = ({ isShow, handleShowHideModals, handleSelected, idProvinsi, idKabupaten, idKecamatan }) => {
    const [keywords, setKeywords]     = useState("")
    const [activeData, setActiveData] = useState({ value: 0, label: "" })
    const [loading, setLoading]       = useState(true)
    const [listData, setData]         = useState<Schema.GetResponseAdmProvinsiIdProvinsiKotaKabIdKotaKabKecamatanIdKecamatan>([])

    const getData = async (search="") => {
        setLoading(true)
        try {
            const dataResponse = await kelRequest(idProvinsi, idKabupaten, idKecamatan)
            if(search === "") {
                setData(dataResponse)

            } else {
                let convert = []
                for(let i=0; i<dataResponse.length; i++) {
                    if(dataResponse[i].nama.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1) {
                        convert.push(dataResponse[i])
                    }
                }

                setData(convert)
            }

        } catch (error) {
            ToastAndroid.show("Gagal mengmbil data !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        if(isShow) {
            getData()
        }
        
        return () => {
            setData([])
        }
    }, [isShow])

    useEffect(() => {
        const debounce = setTimeout(() => {
            getData(keywords)
        }, 500)

        return () => {
            clearInterval(debounce)
        }
    }, [keywords])

    return (
        <ContainerModalsBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
            <View className="h-[50vh]">
                <View className="mb-3">
                    <FormInput
                        value={keywords}
                        onChange={setKeywords}
                        placeholder="Cari ..."
                    />
                </View>
                <View className="flex-1">
                    {
                        loading ?
                            <View className="flex-1 justify-center items-center">
                                <LoadMore isEndPages={false} label="Memuat ..."/>
                            </View>
                        :
                        <>
                            <View className="mb-2">
                                <Text className="font-satoshi text-Neutral/80 text-xs">Hasil {listData.length} Data</Text>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {
                                    listData.length > 0 &&
                                    listData.map((e, i) => (
                                        <TouchableOpacity key={i} onPress={() => setActiveData({ value:e.id, label:e.nama.toUpperCase() })} className="flex-row items-center my-2">
                                            <View>
                                                <RadioButton
                                                    isChecked={activeData.value === e.id ? true : false}
                                                />
                                            </View>
                                            <View className="flex-1 pl-2">
                                                <Text className="font-satoshi text-Neutral/90">{e.nama.toUpperCase()}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        </>
                    }
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

export default ModalsKelurahan