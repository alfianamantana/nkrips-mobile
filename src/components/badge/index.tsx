import { FC, ReactNode } from "react"
import { Text, TouchableOpacity, View } from "react-native"

interface BadgeInterface {
    backgroundColor : string,
    icon? : ReactNode,
    textColor : string,
    label : string,
    onPress : () => void
}

const Badge:FC<BadgeInterface> = ({ backgroundColor="", onPress, icon, textColor="", label }) => {
    return (
        <TouchableOpacity onPress={onPress} className={`rounded-xl px-4 h-[30px] flex-row items-center ${backgroundColor !== "" ? backgroundColor : ""} }`}>
            {
                icon &&
                icon
            }

            <View className="pl-3">
                <Text className={`font-satoshi font-medium text-xs ${textColor}`}>{label}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Badge