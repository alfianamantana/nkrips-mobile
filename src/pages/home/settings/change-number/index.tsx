import { Text, View } from "react-native"
import Assets from "../../../../assets"
import Components from "../../../../components"
import { FC, useState } from "react"

interface ChangeNumberInterface {
    navigation : any
}

const ChangeNumber:FC<ChangeNumberInterface> = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    const proccessChange = () => {
        setShowSuccess(!showSuccess)
    }

    const finish = () => {
        navigation.navigate("ListChat")
    }

    return (
        <View className="flex-1 bg-white p-4 justify-center">
            {
                !showSuccess ?
                    <View>
                        <View className="justify-center items-center">
                            <Assets.ImageChangNumber width={120} height={120}/>
                        </View>
                        <View className="my-4">
                            <Text className="font-satoshi text-Neutral/90 font-medium text-center text-md">Masukkan nomor telepon baru anda</Text>
                        </View>
                        <View className="mt-5">
                            <Components.FormInput
                                placeholder="Masukan nomor telepone"
                                onChange={setPhoneNumber}
                                value={phoneNumber}
                                label="Nomor Telepon"
                                prefix={
                                    <View className="border-r border-r-Neutral/90 pr-2 mr-1">
                                        <Text className="font-satoshi text-Neutral/90">+62</Text>
                                    </View>
                                }
                            />
                        </View>
                        <View className="mt-5">
                            <Components.Button
                                label="Ganti Nomor Telepon"
                                onPress={proccessChange}
                            />
                        </View>
                    </View>
                :
                    <View>
                        <View>
                            <Text className="font-bold text-Neutral/90 font-satoshi text-lg text-center">Nomor Telepon Anda Berhasil Diubah!</Text>
                        </View>
                        <View className="items-center my-10">
                            <Assets.ImageChangeNumberSuccess width={120} height={120}/>
                        </View>
                        <View>
                            <Components.Button
                                label="Selesai"
                                onPress={finish}
                            />
                        </View>
                    </View>
            }

        </View>
    )
}

export default ChangeNumber