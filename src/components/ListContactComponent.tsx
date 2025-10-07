import { Image, Text, TouchableOpacity, View } from "react-native"
import Assets from "../assets"
import { useNavigation } from "@react-navigation/native"
import { FC } from "react"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../tailwind.config"
import { UserWithCheckBox } from "../pages/home/list-contact/new-group/chose-member"
import RadioButton from "./radioButton";

const { theme } = resolveConfig(tailwindConfig)

interface ListContactInterface {
  item: UserWithCheckBox,
  showCheckbox: boolean,
  pressCheckBox?: (value: boolean, item: UserWithCheckBox) => void,
}

const ListContact: FC<ListContactInterface> = ({ item, showCheckbox, pressCheckBox }) => {
  const navigation: any = useNavigation()

  return (
    <TouchableOpacity
      onPress={
        showCheckbox ?
          () => pressCheckBox && pressCheckBox(!item.isChecked, item)
          :
          () => navigation.navigate("DetailChat", {
            public_hash: item.public_hash,
            isComunity: false
          })
      }
      className="flex-row items-center my-1"
    >
      <View className="w-2/12">
        {
          item.profile_picture_url !== null ?
            <Image source={{ uri: item.profile_picture_url }} width={45} height={45} className="rounded-full" />
            :
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: "#F3F4F6",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Image source={Assets.ImageNkrips} style={{ width: 45, height: 45 }} />
            </View>
        }
      </View>
      <View className={`${showCheckbox ? "w-8/12" : "w-10/12"}`}>
        <Text className="font-satoshi text-black font-medium">{item.name}</Text>
      </View>

      {
        showCheckbox &&
        <View className="w-2/12 items-end">
          <RadioButton isChecked={item.isChecked!} />
        </View>
      }
    </TouchableOpacity>
  )
}

export default ListContact