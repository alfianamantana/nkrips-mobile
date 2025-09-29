import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import Assets from "../assets"
import { useNavigation } from "@react-navigation/native"
import { AttachmentType } from "@pn/watch-is/model"
import { FC, useEffect, useState } from "react"
import moment from "moment-timezone"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../routes"
import AsyncStorage from "@react-native-async-storage/async-storage"
type DetailChatNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetailChat'>;

interface User {
  accept_snk_at: string;
  address: string;
  created_at: string;
  date_of_birth: string;
  email: string;
  email_forgot_password_token: string | null;
  email_verification_token: string | null;
  email_verified_at: string | null;
  fcm_token: string | null;
  id: number;
  last_socket_id: string | null;
  mp_bank_acc_branch: string | null;
  mp_bank_acc_name: string | null;
  mp_bank_acc_number: string | null;
  mp_bank_name: string | null;
  name: string;
  phone_number: string;
  profile_banner_url: string | null;
  profile_picture_url: string | null;
  public_hash: string;
  username: string;
}

interface Message {
  data: string;
  id: number;
  id_community_to: number | null;
  id_community_topic_to: number | null;
  id_message_reply_to: number | null;
  id_user_from: number;
  id_user_to: number;
  is_deleted: boolean;
  is_edited: boolean;
  is_latest_message: boolean;
  is_pinned: boolean;
  otm_id_community_to: any;
  otm_id_message_reply_to: any;
  otm_id_user_from: User;
  otm_id_user_to: User;
  pinned_until: string | null;
  ts: string;
}

interface LatestMessageCardData {
  list_attachment: any[];
  message: Message;
}

interface ListChatInterface {
  isLast: boolean,
  data: LatestMessageCardData
}

const ListChat: FC<ListChatInterface> = ({ isLast = false, data }) => {
  const navigation = useNavigation<DetailChatNavigationProp>()
  const [myPublicHash, setMyPublicHash] = useState("")
  const [loading, setLoading] = useState(true)
  const [nameChat, setNameChat] = useState("")
  const [groupChat, setGroupChat] = useState(false)

  const detailChat = async () => {
    let public_hash = ""
    let isCommunity = false

    if (data.message.id_community_to) {
      public_hash = data.message.otm_id_community_to.public_identifier
      isCommunity = true
    } else {
      if (data.message.otm_id_user_to.public_hash === myPublicHash) {
        public_hash = data.message.otm_id_user_from.public_hash
      } else {
        public_hash = data.message.otm_id_user_to.public_hash
      }
    }
    navigation.navigate("DetailChat", {
      public_hash: public_hash,
      isComunity: isCommunity
    })
  }

  useEffect(() => {
    setLoading(true)
    const requestUser = async () => {
      const user: string | null = await AsyncStorage.getItem("user")

      if (user !== null) {
        const parseUser: User = JSON.parse(user)
        if (data?.message?.otm_id_community_to && data?.message?.otm_id_community_to.id) {
          setNameChat(data?.message?.otm_id_community_to.name)
          setGroupChat(true)
        } else if (data?.message?.otm_id_user_from?.username === parseUser.username) {
          setNameChat(data?.message?.otm_id_user_to?.name)
        } else {
          setNameChat(data?.message?.otm_id_user_from?.name)
        }
        setMyPublicHash(parseUser.public_hash)
      }
      setLoading(false)
    }

    requestUser()
  }, [])

  if (loading) {
    return (
      <View className="flex-row w-12/12 items-center my-1 pb-3 justify-center" style={{ minHeight: 80 }}>
        <ActivityIndicator size="small" color="#ef4444" />
      </View>
    )
  }

  return (
    <TouchableOpacity onPress={() => detailChat()} className={`flex-row w-12/12 items-center my-1 pb-3 ${isLast ? "border-b border-b-gray-100" : ""}`}>
      <View className="pr-3">
        {
          groupChat ?
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
              <Assets.ImageGroupEmptyProfile width={60} height={60} />
            </View>
            : (
              <Assets.ImageEmptyProfile width={60} height={60} />
            )
        }
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <View className="w-10/12">
            <Text className="font-satoshi font-medium text-black text-md">
              {nameChat}
            </Text>
          </View>
          <View className="w-2/12 items-end">
            <Text className="font-satoshi text-Primary/Main text-md">
              {moment(data.message.ts).format("HH:mm")}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center pt-1">
          <View className="w-10/12">
            {
              data.message.is_deleted &&
              <Text className="font-satoshi text-gray-500 italic" numberOfLines={1}>
                {
                  data?.list_attachment?.length > 0 &&
                  data?.list_attachment[0]?.type === AttachmentType.IMAGE &&
                  (
                    <View className="pr-1">
                      <Assets.IconGallery width={15} height={15} />
                    </View>
                  )
                }
                Deleted message
              </Text>
            }
            {
              !data.message.is_deleted &&
              data?.list_attachment?.length > 0 &&
              data?.list_attachment[0]?.type === AttachmentType.IMAGE &&
              <View className="flex-row items-center">
                <View className="pr-1">
                  <Assets.IconGallery width={15} height={15} />
                </View>
                <View>
                  <Text className="font-satoshi text-gray-500" numberOfLines={1}>Image</Text>
                </View>
              </View>
            }

            {
              !data.message.is_deleted &&

              data?.list_attachment?.length > 0 &&
              data?.list_attachment[0]?.type === 'AUDIO' &&
              <View className="flex-row items-center">
                <View className="pr-1">
                  <Assets.IconSound2 width={15} height={15} />
                </View>
                <View>
                  <Text className="font-satoshi text-gray-500" numberOfLines={1}>Audio</Text>
                </View>
              </View>
            }

            {
              !data.message.is_deleted &&

              data?.list_attachment?.length > 0 &&
              data?.list_attachment[0]?.type === AttachmentType.FILE &&
              <View className="flex-row items-center">
                <View className="pr-1">
                  <Assets.IconDocument width={15} height={15} />
                </View>
                <View>
                  <Text className="font-satoshi text-gray-500" numberOfLines={1}>File</Text>
                </View>
              </View>
            }

            {
              !data.message.is_deleted &&

              data?.list_attachment?.length > 0 &&
              data?.list_attachment[0]?.type === AttachmentType.VIDEO &&
              <View className="flex-row items-center">
                <View className="pr-1">
                  <Assets.IconVideoBlack width={15} height={15} />
                </View>
                <View>
                  <Text className="font-satoshi text-gray-500" numberOfLines={1}>Video</Text>
                </View>
              </View>
            }

            {
              !data.message.is_deleted &&

              data?.list_attachment?.length <= 0 &&
              <Text className="font-satoshi text-gray-500" numberOfLines={1}>{data?.message?.data}</Text>
            }
          </View>
          {/* <View className="w-2/12 items-end">
                        <View className="min-w-[20px] h-[20px] rounded-full bg-Primary/Main items-center justify-center px-1">
                            <Text className="font-satoshi text-xs text-white">99</Text>
                        </View>
                    </View> */}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ListChat