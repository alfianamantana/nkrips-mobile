import { View } from "react-native"
import Assets from "../../assets"
import { FC } from "react"

interface RadioButtonInterface {
    isChecked : boolean
}

const RadioButton:FC<RadioButtonInterface> = ({ isChecked }) => {
    return (
        <View className="w-[20px] h-[20px] border border-Neutral/40 rounded-full">
            {
                isChecked &&
                <View className="w-[18px] h-[18px] rounded-full bg-Primary/Main items-center justify-center">
                    <Assets.IconChecked width={17} height={17}/>
                </View>
            }
        </View>
    )
}

export default RadioButton