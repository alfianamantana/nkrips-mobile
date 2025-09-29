import { useNavigation } from "@react-navigation/native"
import { Text, TouchableOpacity, View } from "react-native"
import Assets from "../../assets"

const AddAnggota = () => {
    const navigation:any = useNavigation()

    return (
        <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="flex-row items-center my-1"
        >
            <View className="w-2/12">
                <View className="w-[45px] h-[45px] items-center justify-center bg-Primary/Main/10 rounded-full my-2">
                    <Assets.IconPlus width={25} height={25}/>
                </View>
            </View>
            <View className={`w-10/12`}>
                <Text className="font-satoshi text-black font-medium">Tambah Anggota</Text>
            </View>
        </TouchableOpacity>
    )
}

export default AddAnggota