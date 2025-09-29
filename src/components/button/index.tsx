import { FC, ReactNode } from "react"
import { TouchableOpacity, Text, ActivityIndicator } from "react-native"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../../tailwind.config"

const {theme} = resolveConfig(tailwindConfig)

interface ButtonInterface {
    label       : string,
    onPress     : () => void,
    loading?    : boolean,
    isDisabled?  : boolean,
    customColor? : string,
    customIcon?  : ReactNode,
    customColorText? : string,
    customHeight? : number
}

const Button:FC<ButtonInterface> = ({ label, customHeight=0, onPress, loading, isDisabled, customIcon=null, customColor="", customColorText="" }) => {
    return (
        <TouchableOpacity style={{ height: customHeight > 0 ? customHeight : 48 }} disabled={isDisabled} onPress={onPress} className={`${isDisabled ? customColor !== "" ? customColor : "bg-Primary/Main/70" : customColor !== "" ? customColor : "bg-Primary/Main"} rounded-md flex-row px-1 items-center justify-center`}>
            {
                loading ?
                    <ActivityIndicator color={theme?.colors!["Neutral/10"] as string} size="small"/>
                :
                    customIcon
            }

            {
                (label !== "" && label !== undefined) &&
                <Text className={`${customColorText !== "" ? customColorText : "text-white"} font-satoshi font-medium text-sm px-2`}>{label}</Text>
            }
        </TouchableOpacity>
    )
}


export default Button