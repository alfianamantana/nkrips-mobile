import { FC, Fragment, useCallback, useEffect, useState } from "react"
import { FlatList, Text, ToastAndroid, TouchableOpacity, View, RefreshControl } from "react-native"
import SplashScreen from "react-native-splash-screen"
import Assets from "../../assets"
import Components from "../../components"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { listMessageRequest } from "../../services/home/chat"
import { Message } from "@pn/watch-is/model"
import { useFocusEffect } from "@react-navigation/native"
import { WS_URL } from "@env"
import { io } from "socket.io-client"

interface ListChatInterface {
  navigation: any
}

const ListChat: FC<ListChatInterface> = ({ navigation }) => {
  const [refreshing,] = useState(false)
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingListChat, setLoadingListChat] = useState(false);
  const [isEndPages, setIsEndPages] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token")
    const checkRegister = await AsyncStorage.getItem("isRegisterFinish")

    if (token === undefined || token === null) {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("isRegisterFinish")
      await AsyncStorage.removeItem("user")
      navigation.navigate("Login")
    }

    if (checkRegister !== undefined || checkRegister !== null) {
      if (checkRegister === "false") {
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("isRegisterFinish")
        await AsyncStorage.removeItem("user")

        navigation.navigate("Login")
      }
    }

    SplashScreen.hide()
    if (token !== null) {
      dataChat()
    }
  }

  const dataChat = async (isFirst = true, page = 1, isPaginate = false) => {
    if (!isPaginate) {
      setLoadingListChat(isFirst)
    }

    try {
      const chat = await listMessageRequest(page)
      if (chat.length > 0) {
        if (!isPaginate) {
          setMessages(chat)
        } else {
          let combine = [...messages, ...chat]
          setMessages(combine as Message[])
        }

      } else {
        setIsEndPages(true)
      }

    } catch (error) {

      // ToastAndroid.show("Gagal mengambil data list pesan !", ToastAndroid.SHORT)

    } finally {
      setLoadingListChat(false)
    }
  }

  const handlePagination = () => {
    if (!isEndPages) {
      const pagePlusOne = currentPage + 1
      dataChat(true, pagePlusOne, true)
      setCurrentPage(pagePlusOne)
    }
  }

  useFocusEffect(
    useCallback(() => {
      checkAuth()

      return () => {
        setIsEndPages(false)
      }
    }, [])
  )

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    const AuthWs = async () => {
      const token = await AsyncStorage.getItem("token")
      socket.emit('identify-me', `Bearer ${token}`)
    }

    socket.on('receive-msg', () => {
      dataChat(false)
    })

    AuthWs()
    return () => {
      socket.disconnect();
    };
  }, [messages])

  return (
    <View className="flex-1 bg-white px-4 relative">
      <View className="flex-1">
        {
          loadingListChat ?
            [...Array(10)].map((e, i) => (
              <View className="flex-row items-center my-2" key={i}>
                <View className="w-[60px] h-[60px] rounded-full bg-Neutral/20">
                </View>
                <View className="flex-1 pl-3">
                  <View className="h-[17px] w-12/12 rounded-md bg-Neutral/20"></View>
                  <View className="mt-2 h-[17px] w-4/12 rounded-md bg-Neutral/20"></View>
                </View>
              </View>
            ))
            :
            messages.length > 0 ?
              <FlatList
                removeClippedSubviews
                initialNumToRender={5}
                data={messages}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={dataChat} />}
                renderItem={({ item, index }) => {
                  return (
                    <Components.ListChat
                      isLast={(messages.length - 1) === index ? false : true}
                      key={index}
                      data={item}
                    />
                  )
                }}
                onEndReached={handlePagination}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => (
                  <Components.LoadMore label="Memuat Pesan ..." isEndPages={isEndPages} />
                )}
              />
              :
              <View className="justify-center items-center flex-1">
                <Text className="font-satoshi font-medium text-primary">Belum ada pesan !</Text>
              </View>
        }

      </View>
      <View className="items-end justify-end absolute bottom-[20px] right-[20px]">
        <TouchableOpacity id="new-message-button" onPress={() => navigation.navigate("PesanBaru")} style={{ zIndex: 10 }}>
          <Assets.ImageNewMessage width={70} height={70} />
        </TouchableOpacity>
      </View>

      <Components.SideBar />
    </View>
  )
}

export default ListChat