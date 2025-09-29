import { FC, Fragment } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../../tailwind.config"
const {theme} = resolveConfig(tailwindConfig)

interface LoadMoreInterface {
    isEndPages : boolean,
    label      : string
}

const LoadMore:FC<LoadMoreInterface> = ({isEndPages, label}) => {
    return (
        <Fragment>
            {
                !isEndPages &&
                <View className="flex-row items-center justify-center py-2">
                    <View>
                        <ActivityIndicator size="small" color={theme?.colors!["Primary/Main"] as string}/>
                    </View>
                    <View className="pl-2">
                        <Text className="font-satoshi text-black">{label}</Text>
                    </View>
                </View>
            }
        </Fragment>
    )
}

export default LoadMore