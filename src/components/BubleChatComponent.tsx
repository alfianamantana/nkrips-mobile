import { AttachmentType, Message } from "@pn/watch-is/model"
import { useNavigation } from "@react-navigation/native"
import { Dimensions, Text, View, TouchableOpacity, Image } from "react-native"
import Video from "react-native-video"
import Assets from "../assets"
import { downloadWithCheckPermissioin } from "../helpers/downloadFile"
import moment from "moment-timezone"
import { FC } from "react"
import { ChatItem } from "../constants/interface"
interface BubbleChatInterface {
  setShowMenuChatHold: () => void,
  setReplyMessage: (item: Message) => void,
  item: ChatItem,
  isLeft: boolean,
  myUser: object,
  onPressPin?: (item: Message) => void;
  onUnpin?: (item: Message) => void;
  onDelete?: (item: Message) => void;
  onEdit?: (item: Message) => void;
  scrollToMessage?: (id: number) => void;
  onLongPressBubble?: (e: any, item: ChatItem) => void;
  isComunity?: boolean;
}

const BubbleChat: FC<BubbleChatInterface> = ({
  item,
  isLeft,
  myUser,
  scrollToMessage,
  onLongPressBubble,
  isComunity
}) => {
  const navigation: any = useNavigation()
  const screenWidth = Dimensions.get("screen").width
  const replyData = item?.message?.otm_id_message_reply_to;
  const myUserId = (myUser as any)?.id;
  const userFromId = item?.message?.otm_id_user_from?.id;
  const userToId = item?.message?.otm_id_user_to?.id;
  let replyName = "";
  if (replyData) {
    if (replyData.id_user_from === myUserId) {
      replyName = "You";
    } else if (replyData.id_user_from === userFromId) {
      replyName = item?.message?.otm_id_user_from?.name || "User";
    } else if (replyData.id_user_from === userToId) {
      replyName = item?.message?.otm_id_user_to?.name || "User";
    } else {
      replyName = "User";
    }
  }

  function renderMessageText(text: string, navigation: any) {
    const regex = /\[Lihat detail barang\]\(nkrips:\/\/post\/([a-zA-Z0-9]+)\)/g;
    let lastIndex = 0;
    let result: any[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const public_hash = match[1];
      // Teks sebelum link
      if (match.index > lastIndex) {
        result.push(
          <Text key={`before-${match.index}`}>
            {text.substring(lastIndex, match.index)}
          </Text>
        );
      }
      // Link yang bisa di-tap
      result.push(
        <Text
          key={`link-${public_hash}-${match.index}`}
          className="text-blue-600 underline"
          onPress={() => navigation.navigate("DetailPost", { public_hash })}
        >
          Lihat detail barang
        </Text>
      );
      lastIndex = match.index + match[0].length;
    }
    // Teks setelah link terakhir
    if (lastIndex < text.length) {
      result.push(
        <Text key={`after-${lastIndex}`}>
          {text.substring(lastIndex)}
        </Text>
      );
    }
    // Jika tidak ada link, tampilkan biasa
    if (result.length === 0) {
      return <Text>{text}</Text>;
    }
    return <Text>{result}</Text>;
  }

  const replyAttachments = item?.message_reply_to?.list_attachment || [];

  const replyImages = replyAttachments.filter(att => att.type === "IMAGE" && att.url);
  return (
    <View className={`${!isLeft ? "items-end" : "items-start"} w-full my-2 relative`}>
      {replyData && replyData?.is_deleted === false && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (scrollToMessage && replyData.id) {
              scrollToMessage(replyData.id);
            }
          }}
          className="mb-1 rounded-md px-3 py-2 flex-row items-center"
          style={{
            backgroundColor: "#F5F5F5",
            borderLeftWidth: 4,
            borderLeftColor: "#d32f2f",
            maxWidth: screenWidth - 100,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text className="font-satoshi text-xs font-bold text-gray-700 mb-0.5">
              {replyName}
            </Text>
            {/* Jika ada gambar di reply, tampilkan */}
            {replyImages.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 4, marginBottom: 2 }}>
                {replyImages.map((img, idx) => {
                  return (
                    <Image
                      key={img.id || idx}
                      source={{ uri: img.url }}
                      style={{ width: 40, height: 40, borderRadius: 6 }}
                      resizeMode="cover"
                    />
                  )
                })}
              </View>
            )}
            {/* Jika ada text di reply, tampilkan */}
            {replyData.data ? (
              <Text className="font-satoshi text-xs text-gray-800" numberOfLines={1}>
                {replyData.data}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={(e) => onLongPressBubble && onLongPressBubble(e, item)}
        delayLongPress={250}
      >

        <View className={`${!isLeft ? "bg-gray-200" : "bg-white"} p-4 rounded-md`} style={{ maxWidth: screenWidth - 60 }}>
          {/* show name if community chat and is left */}
          {
            isLeft && isComunity && (
              <Text className="text-primary">{item?.message?.otm_id_user_from?.name}</Text>
            )
          }
          {
            item?.list_attachment?.length > 0 &&
            item?.list_attachment?.map((attachment, i: number) => {
              return (
                <View key={i}>
                  {
                    attachment.type === AttachmentType.VIDEO &&
                      attachment.url !== null ?
                      (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("PreviewMedia", {
                            type: AttachmentType.VIDEO,
                            name: attachment.filename,
                            url: attachment.url
                          })}
                          key={i}
                          className="mb-2 relative items-center justify-center"
                        >
                          <Video
                            source={{ uri: attachment.url }}
                            resizeMode="cover"
                            className="w-[200px] h-[200px] opacity-20 rounded-md"
                            paused={true}
                          />

                          <View className="bg-black/20 absolute w-full h-full items-center justify-center">
                            <Assets.IconVideoBlack width={30} height={30} />
                          </View>
                        </TouchableOpacity>

                      ) : attachment.type === AttachmentType.IMAGE &&
                        attachment.url !== null ? (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("PreviewMedia", {
                            type: AttachmentType.IMAGE,
                            name: attachment.filename,
                            url: attachment.url!
                          })}
                          key={i}
                          className="mb-2"
                        >
                          <Image
                            source={{ uri: attachment.url! }}
                            width={200}
                            height={200}
                            resizeMode="cover"
                            className="rounded-md"
                          />
                        </TouchableOpacity>

                      ) : attachment.type === AttachmentType.FILE &&
                        attachment.url !== null ? (
                        <TouchableOpacity onPress={() => downloadWithCheckPermissioin(attachment.filename, attachment.url!)} key={i} className="flex-row items-center mb-2">
                          <View>
                            <Text numberOfLines={1} className="font-satoshi text-black font-medium">{attachment.filename}</Text>
                          </View>
                          <View className="ml-2">
                            <Assets.IconArrowDown width={30} />
                          </View>
                        </TouchableOpacity>
                      )
                        : attachment.type === 'AUDIO' &&
                          attachment.url !== null ? (
                          <TouchableOpacity
                            onPress={() => navigation.navigate("PreviewMedia", {
                              type: AttachmentType.VIDEO,
                              name: attachment.filename,
                              url: attachment.url
                            })}
                            key={i}
                            className="mb-2 relative items-center justify-center"
                          >
                            <View className="p-24 bg-gray-200 rounded-md" />
                            <View className="bg-black/20 absolute w-full h-full items-center justify-center">
                              <Assets.IconVideoBlack width={30} height={30} />
                            </View>
                          </TouchableOpacity>
                        )
                          : null
                  }
                </View>
              )
            }
            )
          }
          <View>
            <Text className="font-satoshi text-black">
              {renderMessageText(item.message.data, navigation)}
            </Text>
          </View>
          <View className="flex flex-row-reverse">
            <View className="flex flex-row mt-2 gap-x-2">
              {/* Tambahkan icon pin jika pesan dipin */}
              {item?.message?.is_pinned && (
                <Assets.IconPin width={18} height={18} />
              )}
              {item?.message?.is_edited && (
                <Text style={{ color: "#888", fontSize: 10 }}>edited</Text>
              )}
              <Text className="font-satoshi text-black text-xs">{moment(item.message.ts).format("HH:mm")}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default BubbleChat