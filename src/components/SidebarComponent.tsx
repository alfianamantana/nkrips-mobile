import { View, TouchableOpacity, Text, Image, ToastAndroid } from "react-native"
import Assets from "../assets"
import SideBarContainer from "./SidebarContainerComponent"
import { storeShowSideBar } from "../store"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { myProfileRequest } from "../services/home/profile"
import { Schema } from "@pn/watch-is/driver"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../routes"
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DetailChatNavigationProp = NativeStackNavigationProp<RootStackParamList, "PostProfile">;

const SideBar = () => {
  const navigation = useNavigation<DetailChatNavigationProp>()
  const { showSideBar, setShowSideBar } = storeShowSideBar()
  const [loading, setLoading] = useState(false)
  const [dataUser, setDataUser] = useState<Schema.ProfileData["user"] | any>({})
  const [isVerified, setIsVerified] = useState(false)
  const insets = useSafeAreaInsets();

  const myprofile = async () => {
    setLoading(true)
    try {
      const profile = await myProfileRequest()
      setIsVerified(profile.verified)
      setDataUser(profile.user)

    } catch (error) {
      ToastAndroid.show("Gagal mengambil data profil !", ToastAndroid.SHORT)

    } finally {
      setLoading(false)
    }
  }

  const clickMenu = (path: string, params: any = null) => {
    setShowSideBar()
    navigation.navigate(path as any, params as any)
  }

  useEffect(() => {
    if (showSideBar) {
      myprofile()
    }
  }, [showSideBar])

  return (
    <SideBarContainer isShow={showSideBar} handleClose={setShowSideBar}>
      <View className="left-0 top-0 h-screen bg-white border border-gray-100" style={{ width: 250 }}>
        <View>
          <Image source={require("../assets/images/image-background-profile.png")} className="w-full" />
        </View>
        <TouchableOpacity
          onPress={() => clickMenu("PostProfile", {
            username: dataUser.username,
            isMyProfile: true
          })}
          className="px-4 top-[-30px]"
        >
          <View>
            <View className="bg-white items-center justify-center rounded-full w-[75px] h-[75px]">
              {
                Object.keys(dataUser).length > 0 &&
                  dataUser.profile_picture_url !== null ?
                  <Image source={{ uri: dataUser.profile_picture_url }} width={70} height={70} className="rounded-full" />
                  :
                  <Assets.ImageEmptyProfile width={70} height={70} />
              }
            </View>
          </View>
          <View className="mt-2">
            <View>
              {
                loading ?
                  <View className="bg-gray-100 rounded-md h-[20px] animate-pulse"></View>
                  :
                  Object.keys(dataUser).length > 0 &&
                  <>
                    <Text className="font-satoshi text-black font-bold">{dataUser.name}</Text>
                    <Text className="font-satoshi text-Neutral/70 text-xs">( {dataUser.username} )</Text>
                  </>
              }
            </View>
            <View className="mt-2">
              <Text className="font-satoshi text-gray-600 text-xs">Lihat Profile</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View className="border-t border-t-gray-200 p-4 flex-1">
          <TouchableOpacity
            onPress={() => clickMenu("MyFriends")}
            className="my-2"
          >
            <Text className="font-satoshi text-black font-bold">Teman Saya</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => clickMenu("MyGroup")}
            className="my-2"
          >
            <Text className="font-satoshi text-black font-bold">Grub Saya</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => clickMenu("MyBadge")}
            className="my-2"
          >
            <Text className="font-satoshi text-black font-bold">Lencana Saya</Text>
          </TouchableOpacity>
          {
            isVerified ? (
              <TouchableOpacity
                onPress={() => clickMenu("PengajuanSaya")}
                className="my-2"
              >
                <Text className="font-satoshi text-black font-bold">Pengajuan Saya</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => clickMenu("RegisterJadab")}
                className="my-2"
              >
                <Text className="font-satoshi text-Primary/Main font-bold">Daftar Komunitas Jadab !</Text>
              </TouchableOpacity>

            )
          }
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowSideBar()
            navigation.navigate("Setting" as never)
          }}
          className="px-4 pt-4 border-t border-t-gray-200 flex-row items-center"
          style={{ paddingBottom: insets.bottom + 24 }} // gunakan safe area bottom
        >
          <View className="mr-3">
            <Assets.IconSetting width={25} height={25} />
          </View>
          <View>
            <Text className="font-satoshi text-black font-medium text-xs">Pengaturan</Text>
          </View>
        </TouchableOpacity>
      </View >
    </SideBarContainer >
  )
}

export default SideBar