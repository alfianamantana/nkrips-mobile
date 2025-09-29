import { Text, TouchableOpacity, View, Image, ToastAndroid, FlatList, RefreshControl, ActivityIndicator, Platform } from "react-native"
import { FC, useCallback, useState, useRef, useEffect } from "react"
import Components from "../../components"
import { Dimensions, Animated } from "react-native";
import Assets from "../../assets"
import { storeShowMenuChat, storeShowMenuChatHold, storeUserChatDetail, storeUserGroupDetail } from "../../store"
import { useFocusEffect } from "@react-navigation/native"
import { listDetailChatRequest, listDetailGroupRequest, postChatGroupRequest, postChatRequest } from "../../services/home/chat"
import { AttachmentType, Message } from "@pn/watch-is/model"
import resolveConfig from 'tailwindcss/resolveConfig'
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from "@react-native-async-storage/async-storage"
import io from 'socket.io-client';
import { WS_URL } from "@env"
import ImagePicker from 'react-native-image-crop-picker';
import { uploadFile } from "../../helpers/uploadFile"
import Clipboard from '@react-native-clipboard/clipboard';
import tailwindConfig from "../../../tailwind.config"
import { Logout } from "../../helpers/logout"
import Video from "react-native-video"
import Modal from "react-native-modal"
import { postPinMessageRequest, deleteMessageRequest, editMessageRequest } from "../../services/home/chat/index"

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const menuWidth = 160;
const menuHeight = 120;



const { theme } = resolveConfig(tailwindConfig)

interface DetailChatInterface {
  navigation: any,
  route: any
}

const DetailChat: FC<DetailChatInterface> = ({ navigation, route }) => {
  let flatListRef = useRef<null | any>(null)

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ uri: string, fileName: string, type: string } | null>(null);
  const [refreshing,] = useState(false)
  const [text, setText] = useState("")
  const [showChoseFile, setShowChoseFile] = useState(false)
  const { showMenuChatHold, setShowMenuChatHold } = storeShowMenuChatHold()
  const { showMenuChat } = storeShowMenuChat()
  const { public_hash, isComunity } = route.params
  const [isEndPages, setIsEndPages] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingSendChat, setLoadingSendChat] = useState(false)
  const [listMessage, setListMessage] = useState<Message[]>([])
  const { dataUser, setDataUser } = storeUserChatDetail()
  const { dataGruop, setDataGruop } = storeUserGroupDetail()
  const [myUser, setMyUser] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [imageSend, setImageSend] = useState({ path: "", mime: "", base64: "" })
  const [fileSend, setFileSend] = useState({ path: "", mime: "", name: "" })
  const [VideoSend, setVideoSend] = useState({ path: "", mime: "", name: "" })
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedPinDuration, setSelectedPinDuration] = useState(1); // default 24 jam
  const [pinMessage, setPinMessage] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const pinnedMessages = listMessage.filter(msg => msg.message.is_pinned);
  const unpinnedMessages = listMessage.filter(msg => !msg.message.is_pinned);
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [menuHeightState, setMenuHeightState] = useState(menuHeight); // menuHeight default (misal 120)


  const startRecording = async () => {
    // Set up recording progress listener
    // Sound.addRecordBackListener((e: RecordBackType) => {
    //     console.log('Recording progress:', e.currentPosition, e.currentMetering);
    //     setRecordSecs(e.currentPosition);
    //     setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
    // });

    // const result = await Sound.startRecorder();
    // console.log('Recording started:', result);
  };

  const stopRecording = async () => {
    // const result = await Sound.stopRecorder();
    // Sound.removeRecordBackListener();
    // console.log('Recording stopped:', result);
  };

  const sendAudioMessage = async () => {
    if (!recordedAudio) return;
    setLoadingSendChat(true);
    try {
      // Upload audio ke server
      const uploadRes = await uploadFile(
        Platform.OS === "android" ? recordedAudio.uri : recordedAudio.uri.replace("file://", ""),
        recordedAudio.type
      );
      const audioUrl = uploadRes.data.url || uploadRes.data;

      // Kirim pesan ke chat
      const body = {
        message: "",
        attachment: {
          type: "AUDIO",
          filename: audioUrl
        },
        id_reply_message: replyMessage?.message.id
      };

      if (isComunity) {
        await postChatGroupRequest(public_hash, "", "AUDIO", audioUrl, replyMessage?.message.id);
      } else {
        await postChatRequest(public_hash, "", "AUDIO", audioUrl, replyMessage?.message.id);
      }

      setRecordedAudio(null);
      setReplyMessage(null);
      listChat();
    } catch (e) {
      ToastAndroid.show("Gagal mengirim audio!", ToastAndroid.SHORT);
    } finally {
      setLoadingSendChat(false);
    }
  };

  const handleEditMessage = async () => {
    if (!editMessage) return;
    try {
      await editMessageRequest(public_hash, editMessage.message.id, text);
      ToastAndroid.show("Pesan berhasil diedit!", ToastAndroid.SHORT);
      setEditMessage(null);
      setText("");
      setIsEditing(false);
      listChat();
    } catch (err) {
      ToastAndroid.show("Gagal edit pesan!", ToastAndroid.SHORT);
    }
  };

  const [activePinnedIndex, setActivePinnedIndex] = useState(
    pinnedMessages.length > 0 ? 0 : -1
  );

  useEffect(() => {
    if (pinnedMessages.length > 0) {
      setActivePinnedIndex(0); // index 0 = paling baru
    }
  }, [pinnedMessages.length]);

  const scrollToMessage = (messageId: number) => {
    const idx = listMessage.findIndex(msg => msg.message.id === messageId);
    if (idx !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: idx, animated: true });
    }
  };
  const listChat = async (page = 1, isPaginate = false) => {
    try {
      if (!isComunity) {
        const chat = await listDetailChatRequest(public_hash, 10, page)
        if (chat.user !== null) {
          setDataUser(chat.user)
        }

        if (chat?.messages?.length > 0) {

          if (!isPaginate) {
            setListMessage(chat.messages)

          } else {
            let combine = [...listMessage, ...chat.messages]
            setListMessage(combine as Message[])
          }

        } else {
          setIsEndPages(true)
        }

      } else {
        const chatGroup = await listDetailGroupRequest(public_hash, 10, page)
        if (chatGroup.community !== null) {
          setDataGruop(chatGroup.community)
        }

        if (chatGroup.messages.length > 0) {

          if (!isPaginate) {
            setListMessage(chatGroup.messages)

          } else {
            let combine = [...listMessage, ...chatGroup.messages]
            setListMessage(combine as Message[])
          }

        } else {
          setIsEndPages(true)
        }
      }

    } catch (error) {
      Logout(error, navigation)
      ToastAndroid.show("Gagal mengambil daftar pesan !", ToastAndroid.SHORT)

    } finally {
      setLoading(false)
    }
  }
  const sendChat = async () => {
    setLoadingSendChat(true)
    try {
      const replyId = replyMessage ? replyMessage.message.id : undefined;

      if (isComunity) {
        if (imageSend.path !== "") {
          const sendMessage = await postChatGroupRequest(
            public_hash,
            text,
            AttachmentType.IMAGE,
            imageSend.path.split("/").slice(-1)[0],
            replyId
          );
          const formData = new FormData()

          formData.append("file", {
            name: imageSend.path.split("/").slice(-1)[0],
            type: imageSend.mime,
            uri: Platform.OS === 'android' ? imageSend.path : imageSend.path.replace('file://', ''),
          })

          await uploadFile(`/9/${sendMessage.upload_token}`, formData)
          setImageSend({ path: "", mime: "", base64: "" })
        }

        if (fileSend.path !== "") {
          const sendMessage = await postChatGroupRequest(
            public_hash,
            text,
            AttachmentType.FILE,
            fileSend.name,
            replyId
          );
          const formData = new FormData()

          formData.append("file", {
            name: fileSend.name,
            type: fileSend.mime,
            uri: Platform.OS === 'android' ? fileSend.path : fileSend.path.replace('file://', ''),
          })

          await uploadFile(`/9/${sendMessage.upload_token}`, formData)
          setFileSend({ path: "", mime: "", name: "" })
        }

        if (VideoSend.path !== "") {
          const sendMessage = await postChatGroupRequest(
            public_hash,
            text,
            AttachmentType.VIDEO,
            VideoSend.name,
            replyId
          );
          const formData = new FormData()

          formData.append("file", {
            name: VideoSend.name,
            type: VideoSend.mime,
            uri: Platform.OS === 'android' ? VideoSend.path : VideoSend.path.replace('file://', ''),
          })

          await uploadFile(`/9/${sendMessage.upload_token}`, formData)
          setVideoSend({ path: "", mime: "", name: "" })
        }

        if (imageSend.path === "" && fileSend.path === "" && VideoSend.path === "") {
          await postChatGroupRequest(
            public_hash,
            text,
            undefined,
            undefined,
            replyId
          );
        }

      } else {
        if (imageSend.path !== "") {
          const sendMessage = await postChatRequest(
            public_hash,
            text,
            AttachmentType.IMAGE,
            imageSend.path.split("/").slice(-1)[0],
            replyId
          );
          const formData = new FormData()

          formData.append("file", {
            name: imageSend.path.split("/").slice(-1)[0],
            type: imageSend.mime,
            uri: Platform.OS === 'android' ? imageSend.path : imageSend.path.replace('file://', ''),
          })

          await uploadFile(`/9/${sendMessage.upload_token}`, formData)
          setImageSend({ path: "", mime: "", base64: "" })
        }

        if (fileSend.path !== "") {
          const sendMessage = await postChatRequest(
            public_hash,
            text,
            AttachmentType.FILE,
            fileSend.name,
            replyId
          );
          const formData = new FormData()

          formData.append("file", {
            name: fileSend.name,
            type: fileSend.mime,
            uri: Platform.OS === 'android' ? fileSend.path : fileSend.path.replace('file://', ''),
          })

          await uploadFile(`/9/${sendMessage.upload_token}`, formData)
          setFileSend({ path: "", mime: "", name: "" })
        }

        if (VideoSend.path !== "") {
          const sendMessage = await postChatRequest(
            public_hash,
            text,
            AttachmentType.VIDEO,
            VideoSend.name,
            replyId
          );
          const formData = new FormData()

          formData.append("file", {
            name: VideoSend.name,
            type: VideoSend.mime,
            uri: Platform.OS === 'android' ? VideoSend.path : VideoSend.path.replace('file://', ''),
          })

          await uploadFile(`/9/${sendMessage.upload_token}`, formData)
          setVideoSend({ path: "", mime: "", name: "" })
        }

        if (imageSend.path === "" && fileSend.path === "" && VideoSend.path === "") {
          await postChatRequest(
            public_hash,
            text,
            undefined,
            undefined,
            replyId
          );
        }
      }

      setText("")
      setReplyMessage(null)
      listChat()

    } catch (error) {
      ToastAndroid.show("Gagal mengirim pesan !", ToastAndroid.SHORT)
    } finally {
      setLoadingSendChat(false)
    }
  }

  const getMyUser = async () => {
    const user = await AsyncStorage.getItem("user")
    if (user !== null) {
      const parseUser = JSON.parse(user as string)
      setMyUser(parseUser)
      listChat()
    }
  }

  const handlePagination = () => {
    const plusOnePage = currentPage + 1
    setCurrentPage(plusOnePage)
    listChat(plusOnePage, true)
  }

  const handleChoseFile = async () => {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      setFileSend({ path: pickedFile.uri, mime: pickedFile.type!, name: pickedFile.name! })
      setShowChoseFile(false)

    } catch (error) {
      ToastAndroid.show("Gagal memilih file !", ToastAndroid.SHORT)
    }
  }

  const choseImageCamera = async () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo'
    }).then((image: any) => {
      setImageSend({
        path: image.path,
        base64: `data:${image.mime};base64,${image.data}`,
        mime: image.mime
      })

      setShowChoseFile(false)

    }).catch((error: any) => {
      ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
    });
  }

  const choseImageExplorer = async () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
    }).then((image: any) => {

      setImageSend({
        path: image.path,
        base64: `data:${image.mime};base64,${image.data}`,
        mime: image.mime
      })

      setShowChoseFile(false)

    }).catch((error: any) => {
      ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
    });
  }

  const choseVideoExplorer = async () => {
    ImagePicker.openPicker({
      mediaType: "video"
    }).then((image: any) => {

      setVideoSend({
        path: image.path,
        mime: image.mime,
        name: image.path.split("/").slice(-1)[0]
      })

      setShowChoseFile(false)

    }).catch((error: any) => {
      ToastAndroid.show("Batal mengambil video !", ToastAndroid.SHORT)
    });
  }

  useFocusEffect(
    useCallback(() => {
      getMyUser()

      return () => {
        setDataGruop({} as any)
        setDataUser({} as any)
      }
    }, [public_hash, isComunity])
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

    socket.on('receive-msg', (data) => {

      if (data[0].community_to !== null) {
        let isCombine = true
        if (data[0].list_message_attachment_on_id_message.length > 0) {
          for (let i = 0; i < data[0].list_message_attachment_on_id_message.length; i++) {
            if (data[0].list_message_attachment_on_id_message[i].url === null) {
              isCombine = false
            }
          }
        }

        if (isCombine) {
          const combinedChat = [...data, ...listMessage];
          setListMessage(combinedChat);
        }

      } else {
        if ((data[0].user_to.id === myUser || data[0].user_from.id === myUser) && (data[0].user_to.id === dataUser.id || data[0].user_from.id === dataUser.id)) {

          let isCombine = true
          if (data[0].list_message_attachment_on_id_message.length > 0) {
            for (let i = 0; i < data[0].list_message_attachment_on_id_message.length; i++) {
              if (data[0].list_message_attachment_on_id_message[i].url === null) {
                isCombine = false
              }
            }
          }

          if (isCombine) {
            const combinedChat = [...data, ...listMessage];
            setListMessage(combinedChat);
          }
        }
      }

    })

    socket.on('update-msg', (data) => {
      if (data.community_to !== null) {
        let convertToArray = [data]
        const combinedChat = [...convertToArray, ...listMessage];
        setListMessage(combinedChat);

      } else {
        let convertToArray = [data]
        if ((data.user_to.id === myUser || data.user_from.id === myUser) && (data.user_to.id === dataUser.id || data.user_from.id === dataUser.id)) {
          const combinedChat = [...convertToArray, ...listMessage];
          setListMessage(combinedChat);
        }
      }
    })

    AuthWs()
    return () => {
      socket.disconnect();
    };
  }, [listMessage, dataUser])

  const handleUnpinMessage = async (messageId: number) => {
    try {
      await postPinMessageRequest(public_hash, messageId, 0); // 0 untuk unpin
      ToastAndroid.show("Pesan berhasil di-unpin!", ToastAndroid.SHORT);
      listChat(); // refresh pesan agar status pin terupdate
    } catch (err) {
      ToastAndroid.show("Gagal unpin pesan!", ToastAndroid.SHORT);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await deleteMessageRequest(public_hash, messageId);
      ToastAndroid.show("Pesan berhasil dihapus!", ToastAndroid.SHORT);
      listChat();
    } catch (err) {
      ToastAndroid.show("Gagal menghapus pesan!", ToastAndroid.SHORT);
    }
  };

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  let menuLeft = menuPosition?.x ?? 50;
  let menuTop = (menuPosition?.y ?? 100) - 70;
  if (menuLeft + menuWidth > windowWidth) {
    menuLeft = windowWidth - menuWidth - 12; // 12px margin dari kanan
  }
  // Cegah keluar kiri
  if (menuLeft < 0) {
    menuLeft = 12;
  }
  // Cegah keluar bawah
  if (menuTop + menuHeightState > windowHeight) {
    menuTop = windowHeight - menuHeightState - 100;
  }
  // Cegah keluar atas
  if (menuTop < 0) {
    menuTop = 12;
  }

  const [menuItem, setMenuItem] = useState<Message | null>(null);

  const handleShowMenu = (item: Message, position: { x: number, y: number }) => {
    setMenuItem(item);
    setMenuPosition(position);
    setShowMenu(true);
  };

  const handleHideMenu = () => {
    setShowMenu(false);
    setMenuItem(null);
    setMenuPosition(null);
  };

  useEffect(() => {
    if (showMenu) {
      Animated.spring(menuAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [showMenu]);
  return (
    <View className="flex-1 relative">
      {showMenu && (
        <TouchableOpacity
          id="overlay-menu"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 100,
          }}
          activeOpacity={1}
          onPress={handleHideMenu}
        >
          <Animated.View
            style={{
              position: "absolute",
              top: menuTop,
              left: menuLeft,
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 8,
              elevation: 4,
              minWidth: 140,
              // Animasi scale dan opacity
              opacity: menuAnim,
              transform: [
                {
                  scale: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
              ],
            }}
            onLayout={e => setMenuHeightState(e.nativeEvent.layout.height)}
          >

            {[
              {
                title: "Salin",
                icon: <Assets.IconCopy width={18} height={18} color="#232B36" style={{ marginRight: 10 }} />,
                onPress: () => {
                  Clipboard.setString(menuItem?.message?.data || "");
                  handleHideMenu();
                }
              },
              {
                title: "Balas",
                icon: <Assets.IconReply width={18} height={18} color="#232B36" style={{ marginRight: 10 }} />,
                onPress: () => {
                  setReplyMessage(menuItem!);
                  handleHideMenu();
                }
              },
              {
                title: menuItem?.message?.is_pinned ? "Unpin" : "Pin",
                icon: menuItem?.message?.is_pinned
                  ? <Assets.IconUnpin width={18} height={18} color="#232B36" style={{ marginRight: 10 }} />
                  : <Assets.IconPin width={18} height={18} color="#232B36" style={{ marginRight: 10 }} />,
                onPress: () => {
                  if (menuItem?.message?.is_pinned) {
                    handleUnpinMessage(menuItem.message.id);
                  } else {
                    setPinMessage(menuItem!);
                    setShowPinModal(true);
                  }
                  handleHideMenu();
                }
              },
              ...(menuItem && myUser.id === menuItem.message.id_user_from
                ? [
                  {
                    title: "Edit",
                    icon: <Assets.IconEdit width={18} height={18} color="#232B36" style={{ marginRight: 10 }} />,
                    onPress: () => {
                      setEditMessage(menuItem!);
                      setEditText(menuItem?.message?.data || "");
                      setShowEditModal(true);
                      handleHideMenu();
                    }
                  },
                  {
                    title: "Hapus",
                    icon: <Assets.IconDelete width={18} height={18} color="#d32f2f" style={{ marginRight: 10 }} />,
                    onPress: () => {
                      handleDeleteMessage(menuItem!.message.id);
                      handleHideMenu();
                    }
                  }
                ]
                : []
              ),
            ].map((action, idx, arr) => (
              <TouchableOpacity
                key={idx}
                onPress={action.onPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderBottomWidth: idx < arr.length - 1 ? 1 : 0,
                  borderBottomColor: "#eee"
                }}
              >
                {action.icon}
                <Text style={{ fontSize: 16 }}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      )}

      <View className="absolute left-0 top-0 w-full">
        <Image source={require("../../assets/images/image-background-chat.png")} className="absolute left-0 top-0 w-full h-screen" />
      </View>

      {pinnedMessages.length > 0 && activePinnedIndex !== -1 && (
        <View
          id="pinned-messages"
          style={{
            marginBottom: 8,
            marginTop: 1,
            marginHorizontal: 5,
            maxHeight: 48,
            overflow: "visible",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 1,
            elevation: 1,
          }}
        >
          {/* Icon pin SVG */}
          <Assets.IconPin width={22} height={22} style={{ marginRight: 8 }} color="#8A94A6" />

          {/* Konten pin */}
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            activeOpacity={0.7}
            onPress={() => {
              scrollToMessage(pinnedMessages[activePinnedIndex].message.id);
              if (pinnedMessages.length > 1) {
                setActivePinnedIndex((prev) => (prev + 1) % pinnedMessages.length);
              }
            }}
          >
            {/* Jika ada attachment */}
            {pinnedMessages[activePinnedIndex].list_attachment && pinnedMessages[activePinnedIndex].list_attachment.length > 0 ? (
              <>
                {/* Icon file/gambar */}
                {pinnedMessages[activePinnedIndex].list_attachment[0].type === "IMAGE" ? (
                  <Assets.IconGallery width={18} height={18} style={{ marginRight: 6 }} color="#8A94A6" />
                ) : (
                  <Assets.IconDocument width={18} height={18} style={{ marginRight: 6 }} color="#8A94A6" />
                )}
                {/* Nama file */}
                <Text style={{ color: "#232B36", fontWeight: "500" }} numberOfLines={1}>
                  {pinnedMessages[activePinnedIndex].list_attachment[0].type === "IMAGE" ? "Gambar" : "Dokumen"}
                </Text>
              </>
            ) : (
              // Jika hanya text
              <Text style={{ color: "#232B36", fontWeight: "500" }} numberOfLines={1}>
                {pinnedMessages[activePinnedIndex].message.data}
              </Text>
            )}
          </TouchableOpacity>

          {/* Penanda jika lebih dari 1 pinned */}
          {pinnedMessages.length > 1 && (
            <View style={{
              backgroundColor: "#d32f2f",
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 2,
              alignItems: "center",
              justifyContent: "center",
              minWidth: 32,
              marginLeft: 8
            }}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                {activePinnedIndex + 1}/{pinnedMessages.length}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="flex-1 pt-2 px-4">
        <View className="w-full flex-1">
          {
            loading ?
              <View className="justify-center items-center flex-1 flex-row">
                <View>
                  <ActivityIndicator color={theme?.colors!["Primary/Main"] as string} size="small" />
                </View>
                <View className="ml-3">
                  <Text className="font-satoshi font-medium text-Primary/Main">Memuat pesan ...</Text>
                </View>
              </View>
              : (
                <>
                  {listMessage.length > 0 &&
                    <FlatList
                      ref={flatListRef}
                      removeClippedSubviews
                      initialNumToRender={5}
                      inverted
                      data={listMessage}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={listChat} />}
                      renderItem={({ item, index }: { item: Message, index: number }) => {
                        return (
                          <View key={index}>
                            {
                              myUser.id === item?.message.id_user_from ?
                                <Components.BubbleChat
                                  key={index}
                                  isLeft={false}
                                  item={item}
                                  setReplyMessage={setReplyMessage}
                                  setShowMenuChatHold={setShowMenuChatHold}
                                  myUser={myUser}
                                  onPressPin={(msg) => {
                                    setPinMessage(msg);
                                    setShowPinModal(true);
                                  }}
                                  setShowMenuChatHold={() => {
                                    setShowMenuChatHold(true);
                                    setSelectedMessage(item); // item adalah message yang di-hold
                                  }}
                                  onUnpin={(msg) => {
                                    handleUnpinMessage(msg.message.id);
                                  }}
                                  onDelete={(msg) => handleDeleteMessage(msg.message.id)}
                                  onEdit={(msg) => {
                                    if (msg.list_attachment && msg.list_attachment.length > 0) return;
                                    setEditMessage(msg);
                                    setText(msg.message.data);
                                    setIsEditing(true);
                                  }}
                                  scrollToMessage={scrollToMessage}
                                  onLongPressBubble={(e, item) => {
                                    // Ambil posisi bubble untuk menu
                                    const { pageX, pageY } = e.nativeEvent;
                                    handleShowMenu(item, { x: pageX, y: pageY });
                                  }}
                                />
                                :
                                <Components.BubbleChat
                                  key={index}
                                  isLeft={true}
                                  item={item}
                                  setReplyMessage={setReplyMessage}
                                  setShowMenuChatHold={setShowMenuChatHold}
                                  myUser={myUser}
                                  onPressPin={(msg) => {
                                    setPinMessage(msg);
                                    setShowPinModal(true);
                                  }}
                                  setShowMenuChatHold={() => {
                                    setShowMenuChatHold(true);
                                    setSelectedMessage(item); // item adalah message yang di-hold
                                  }}
                                  onUnpin={(msg) => {
                                    handleUnpinMessage(msg.message.id);
                                  }}
                                  scrollToMessage={scrollToMessage}
                                  onLongPressBubble={(e, item) => {
                                    const { pageX, pageY } = e.nativeEvent;
                                    handleShowMenu(item, { x: pageX, y: pageY });
                                  }}
                                />
                            }
                          </View>
                        )
                      }}
                      onEndReached={handlePagination}
                      onEndReachedThreshold={0.5}
                      ListFooterComponent={() => (
                        <Components.LoadMore isEndPages={isEndPages} label="Memuat pesan ..." />
                      )}
                    />}
                </>
              )
          }
        </View>
      </View>
      <View className="bg-white pt-2 pb-3 px-4">
        {
          VideoSend.path !== "" &&
          <View className="flex-row items-center">
            <View className="flex-1">
              <Video
                source={{ uri: VideoSend.path }}
                resizeMode="cover"
                className="rounded-md w-[100px] h-[100px]"
              />
            </View>
            <TouchableOpacity onPress={() => {
              setVideoSend({
                path: "",
                mime: "",
                name: ""
              })
            }}>
              <Assets.IconTimes width={40} />
            </TouchableOpacity>
          </View>
        }

        {
          imageSend.path !== "" &&
          <View className="flex-row items-center">
            <View className="flex-1">
              <Image
                source={{ uri: imageSend.path }}
                width={100}
                height={100}
                className="rounded-md"
              />
            </View>
            <TouchableOpacity onPress={() => {
              setImageSend({
                path: "",
                base64: "",
                mime: ""
              })
            }}>
              <Assets.IconTimes width={40} />
            </TouchableOpacity>
          </View>
        }

        {
          fileSend.path !== "" &&
          <View className="flex-row items-center">
            <View className="flex-1 py-2">
              <Text numberOfLines={1} className="font-satoshi text-black font-medium">{fileSend.name}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setFileSend({
                path: "",
                name: "",
                mime: ""
              })
            }}>
              <Assets.IconTimes width={40} />
            </TouchableOpacity>
          </View>
        }

        {replyMessage && (
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-2">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">
                Replying to: {replyMessage.message.otm_id_user_from?.id === myUser ? 'You' : replyMessage.message.otm_id_user_from?.name || 'User'}
              </Text>
              {/* Render gambar jika ada di list_attachment */}
              {replyMessage.list_attachment && replyMessage.list_attachment.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 4, marginBottom: 2 }}>
                  {replyMessage.list_attachment
                    .filter(att => att.type === "IMAGE" && att.url)
                    .map((img, idx) => (
                      <Image
                        key={img.id || idx}
                        source={{ uri: img.url }}
                        style={{ width: 40, height: 40, borderRadius: 6, marginRight: 4 }}
                        resizeMode="cover"
                      />
                    ))}
                </View>
              )}
              {/* Render text jika ada */}
              {replyMessage.message.data ? (
                <Text className="text-sm text-gray-800" numberOfLines={1}>
                  {replyMessage.message.data}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => setReplyMessage(null)}>
              <Assets.IconTimes width={18} height={18} />
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row items-center">
          <View className="flex-1">
            <Components.FormInput
              isMultiLine={true}
              isBackground={true}
              value={text}
              onChange={setText}
              placeholder="Ketik pesan"
              customHeight={isEditing ? 80 : 40}
              sufix={
                <View className="flex flex-col gap-y-3">
                  {
                    !showChoseFile ?
                      <TouchableOpacity onPress={() => setShowChoseFile(showChoseFile ? false : true)}>
                        <Assets.IconFile width={20} height={20} />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={() => setShowChoseFile(showChoseFile ? false : true)}>
                        <Assets.IconTimes width={20} height={20} />
                      </TouchableOpacity>
                  }
                  {
                    isEditing && (
                      <TouchableOpacity
                        className=""
                        onPress={() => {
                          setIsEditing(false);
                          setEditMessage(null);
                          setText("");
                        }}
                      >
                        <Assets.IconTimes width={20} height={20} />
                      </TouchableOpacity>
                    )
                  }

                </View>
              }
            />

          </View>
          {isEditing ? (
            <>

              <TouchableOpacity
                className="pl-3 items-end justify-center"
                onPress={handleEditMessage}
              >
                <Assets.IconSend width={30} height={30} />

              </TouchableOpacity>
            </>
          ) : (
            (
              text && !showChoseFile ?
                <TouchableOpacity
                  className="pl-3 items-end justify-center"
                  onPress={
                    (fileSend.path !== "" || imageSend.path !== "" || VideoSend.path !== "") ?
                      () => sendChat()
                      :
                      (text !== "" && text.match(/^\s+$/) === null) ?
                        () => sendChat()
                        :
                        () => { }
                  }
                >
                  {
                    loadingSendChat ?
                      <ActivityIndicator color={theme?.colors!["Primary/Main"] as string} size={30} />
                      :
                      <Assets.IconSend width={30} height={30} />
                  }
                </TouchableOpacity>
                :
                <TouchableOpacity
                  id="mic-button"
                  className="pl-3 items-end justify-center"
                  onPress={async () => {
                    if (isRecording) {
                      await stopRecording();
                    } else {
                      await startRecording();
                    }
                  }}
                >
                  {isRecording ? (
                    // SVG kotak (stop)
                    <View style={{
                      width: 30, height: 30, borderRadius: 15, backgroundColor: "#d32f2f", alignItems: "center", justifyContent: "center"
                    }}>
                      {/* SVG kotak */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect width="18" height="18" x="3" y="3" rx="2" fill="#fff" />
                      </svg>
                    </View>
                  ) : (
                    <Assets.IconMicOn width={30} height={30} />
                  )}
                </TouchableOpacity>
            )
          )}
        </View>

        {
          showChoseFile &&
          <View className="pt-5 pb-4 justify-center flex-row">
            <TouchableOpacity onPress={() => choseImageCamera()} className="flex-1 justify-center items-center">
              <Assets.IconCamera width={35} height={35} />
              <Text className="font-satoshi text-md font-medium text-gray-600 mt-1">Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => choseImageExplorer()} className="flex-1 justify-center items-center">
              <Assets.IconGallery width={35} height={35} />
              <Text className="font-satoshi text-md font-medium text-gray-600 mt-1">Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => choseVideoExplorer()} className="flex-1 justify-center items-center">
              <Assets.IconVideoBlack width={35} height={35} />
              <Text className="font-satoshi text-md font-medium text-gray-600 mt-1">Video</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleChoseFile()} className="flex-1 justify-center items-center">
              <Assets.IconDocument width={35} height={35} />
              <Text className="font-satoshi text-md font-medium text-gray-600 mt-1">File</Text>
            </TouchableOpacity>
          </View>
        }
      </View>

      {/* modal pin  */}
      <Modal
        id="modalPinMessage"
        isVisible={showPinModal}
        onBackdropPress={() => setShowPinModal(false)}
        backdropOpacity={0.4}
      >
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 24,
          alignItems: "flex-start"
        }}>
          <Text style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#232B36",
            marginBottom: 24,
            alignSelf: "center"
          }}>
            Pilih Durasi Pin Pesan
          </Text>
          {[
            { label: "24 Jam", value: 1 },
            { label: "7 Hari", value: 7 },
            { label: "30 Hari", value: 30 }
          ].map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
              onPress={() => setSelectedPinDuration(opt.value)}
            >
              <View style={{
                width: 24, height: 24, borderRadius: 12,
                borderWidth: 2, borderColor: "#d32f2f",
                alignItems: "center", justifyContent: "center",
                marginRight: 12
              }}>
                {selectedPinDuration === opt.value && (
                  <View style={{
                    width: 12, height: 12, borderRadius: 6,
                    backgroundColor: "#d32f2f"
                  }} />
                )}
              </View>
              <Text style={{ fontSize: 18, color: "#232B36" }}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 24,
                marginRight: 12
              }}
              onPress={() => setShowPinModal(false)}
            >
              <Text style={{ color: "#232B36", fontWeight: "500", fontSize: 16 }}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#d32f2f",
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 24
              }}
              onPress={async () => {
                if (pinMessage) {
                  try {
                    await postPinMessageRequest(
                      public_hash,
                      pinMessage.message.id,
                      selectedPinDuration
                    );
                    ToastAndroid.show("Pesan berhasil dipin!", ToastAndroid.SHORT);
                    listChat();
                  } catch (err) {
                    ToastAndroid.show("Gagal pin pesan!", ToastAndroid.SHORT);
                  }
                }
                setShowPinModal(false);
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>Pin Pesan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={showEditModal}
        onBackdropPress={() => setShowEditModal(false)}
        backdropOpacity={0.4}
      >
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 24,
          alignItems: "flex-start"
        }}>
          <Text style={{
            fontWeight: "bold",
            fontSize: 20,
            color: "#232B36",
            marginBottom: 16,
            alignSelf: "center"
          }}>
            Edit Pesan
          </Text>
          <Components.FormInput
            isMultiLine={true}
            isBackground={true}
            value={editText}
            onChange={setEditText}
            placeholder="Edit pesan"
          />
          <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 24,
                marginRight: 12
              }}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={{ color: "#232B36", fontWeight: "500", fontSize: 16 }}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#d32f2f",
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 24
              }}
              onPress={handleEditMessage}
            >
              <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default DetailChat