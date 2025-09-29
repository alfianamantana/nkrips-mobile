import { View, Text, TouchableOpacity, ToastAndroid, Image } from "react-native"
import Components from "../../components"
import { FC, useEffect, useState } from "react"
import Assets from "../../assets"
import { listContactIdUserSearchRequest, listContactPhoneNumberSearchRequest, listContactSearchRequest } from "../../services/home/contact"
import { Schema } from "@pn/watch-is/driver"
import { addFriendRequest } from "../../services/home/profile"

interface AddFriendsInterface {
  navigation: any
}

const AddFriends: FC<AddFriendsInterface> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState(true)
  const [keywords, setKeywords] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingAddFriend, setLoadingAddFriend] = useState(false)
  const [dataUser, setDataUser] = useState<null | Schema.SearchFriendResponse>(null)

  const searchFriends = async () => {
    setLoading(true)
    try {
      console.log(activeFilter, 'activeFilteractiveFilter');

      console.log(keywords, 'keywordskeywords');
      if (activeFilter) {

        const idUser = await listContactIdUserSearchRequest(keywords)
        if (idUser) {
          console.log(idUser, 'idUser');

          setDataUser(idUser)
        }

      } else {
        const phoneNumber = await listContactPhoneNumberSearchRequest(keywords)
        console.log(phoneNumber, 'phoneNumberphoneNumber');

        if (phoneNumber) {
          setDataUser(phoneNumber)
        }
      }

    } catch (error) {
      console.log(error.response, 'errorerror');

    } finally {
      setLoading(false)
    }
  }

  const btnAddFriend = async () => {
    setLoadingAddFriend(true)
    try {
      await addFriendRequest(dataUser?.user.public_hash)
      await searchFriends()

    } catch (error) {
      ToastAndroid.show("Gagal menambahkan teman !", ToastAndroid.SHORT)

    } finally {
      setLoadingAddFriend(false)
    }
  }

  const btnChat = () => {
    navigation.navigate("DetailChat", {
      public_hash: dataUser?.user.public_hash,
      isComunity: false
    })
  }

  const handleChageActiveTab = (value: boolean) => {
    setActiveFilter(value)
    setKeywords("")
    setDataUser(null)
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (keywords !== "") {
        searchFriends()
      }
    }, 500)

    return () => {
      clearInterval(debounce)
    }
  }, [keywords])

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => handleChageActiveTab(true)} className="flex-row items-center">
          <View>
            <Components.RadioButton isChecked={activeFilter ? true : false} />
          </View>
          <View className="pl-2">
            <Text className="font-satoshi text-Neutral/90">ID User</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleChageActiveTab(false)} className="flex-row items-center pl-5">
          <View>
            <Components.RadioButton isChecked={!activeFilter ? true : false} />
          </View>
          <View className="pl-2">
            <Text className="font-satoshi text-Neutral/90">No. Telepon</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="my-3">
        <Components.FormInput
          isBackground={true}
          inputType={activeFilter ? "text" : "number"}
          placeholder={activeFilter ? "Cari ..." : "Masukan nomor telepon"}
          value={keywords}
          onChange={setKeywords}
          sufix={
            <Assets.IconSearch width={15} height={15} />
          }
          prefix={
            !activeFilter &&
            <View className="pr-2 border-r border-r-Neutral/60">
              <Text className="font-satoshi text-Neutral/90">+62</Text>
            </View>
          }
        />
      </View>
      <View className="flex-1 items-center justify-center">
        {
          loading ?
            <View>
              <Components.LoadMore isEndPages={false} label="Loading ..." />
            </View>
            :
            dataUser !== null ?
              <View className="items-center">
                <View>
                  {
                    dataUser?.user?.profile_picture_url !== null ?
                      <Image source={{ uri: dataUser?.user?.profile_picture_url }} width={80} height={80} className="rounded-full" />
                      :
                      <Assets.ImageEmptyProfile width={80} height={80} />
                  }
                </View>
                <View>
                  <View className="my-3">
                    <Text className="text-center font-satoshi font-medium text-Neutral/90 text-md">{dataUser?.user?.username}</Text>
                  </View>

                  {
                    dataUser?.already_friend &&
                    <View className="mb-3">
                      <Text className="text-center font-satoshi font-medium text-Neutral/70 text-xs">Telah ditanbahkan menjadi teman!</Text>
                    </View>
                  }

                  <View>
                    {
                      dataUser?.already_friend ?
                        <Components.Button
                          customColor="bg-Primary/Surface"
                          customColorText="text-Primary/Main"
                          customIcon={<Assets.IconMessageRed />}
                          label="Mulai Obrolan"
                          customHeight={35}
                          onPress={btnChat}
                        />
                        :
                        <Components.Button
                          loading={loadingAddFriend}
                          customIcon={<Assets.IconPlusWhite />}
                          label="Tambah teman"
                          customHeight={35}
                          onPress={btnAddFriend}
                        />
                    }

                  </View>
                </View>
              </View>
              :
              <View>
                <Text className="font-satoshi font-semibold text-md text-center text-Neutral/90">Teman tidak di temukan, lakukan pencarian !</Text>
              </View>
        }
      </View>
    </View>
  )
}

export default AddFriends