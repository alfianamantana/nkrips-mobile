import { FC } from "react"
import { View, Text, TouchableOpacity } from "react-native"

interface TabsInterface {
    dataTab : Array<{
        label : string,
        value : number
    }>
    activeValueTab : number,
    onPress : (value:number) => void
}

const Tabs:FC<TabsInterface> = ({ dataTab, activeValueTab, onPress }) => {
    return (
        <View className="flex-row items-center">
            {
                dataTab.length > 0 &&
                dataTab.map((e, i) => (
                    <TouchableOpacity onPress={() => onPress(e.value)} key={i} className="flex-1 justify-center items-center">
                        <View>
                            <Text className={`${e.value === activeValueTab ? "text-Primary/Main" : "text-Neutral/50"} font-satoshi font-semibold`}>{e.label}</Text>
                        </View>
                        <View className={`h-[4px] rounded-t-lg ${e.value === activeValueTab ? "bg-Primary/Main" : ""} w-6/12 mt-3`}></View>
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}

export default Tabs