import { FC } from "react"
import { Text, View } from "react-native"
import Components from "../../../components"

interface ListCallInterface {
    navigation : any
}

const ListCall:FC<ListCallInterface> = ({ navigation }) => {
    return (
        <View className="flex-1 p-4 bg-white">
            <Components.ListCall/>
        </View>
    )
}

export default ListCall