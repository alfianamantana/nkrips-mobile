import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Camera, Video, File, AudioLines } from "lucide-react-native";
import moment from "moment";
import { ProfileContext } from "@/context/AuthContext";
import { AttachmentType } from "@/api-lib/ts-model/enum/AttachmentType";
import { MessageWithAttachments } from "@/api-lib/ts-schema/MessageWithAttachments";

interface LatestMessageCardProps {
  data: MessageWithAttachments;
  onPress?: () => void;
}

export function LatestMessageCard(props: LatestMessageCardProps) {
  const profile_data = useContext(ProfileContext);

  function getThumbnail(): string {
    if (props.data.message.id_user_to) {

      const user =
        props.data.message.id_user_from == profile_data?.user.id
          ? props.data.message.otm_id_user_to
          : props.data.message.otm_id_user_from;
      return user?.profile_picture_url ?? "";
    }
    if (props.data.message.otm_id_community_to?.id) {
      return props.data.message.otm_id_community_to?.logo
        ? props.data.message.otm_id_community_to?.logo
        : "";
    }
    return "";
  }

  function getName(): string {
    if (props.data.message.id_user_to) {
      const user =
        props.data.message.id_user_from == profile_data?.user.id
          ? props.data.message.otm_id_user_to
          : props.data.message.otm_id_user_from;
      return user?.name ?? "";
    }
    if (props.data.message.otm_id_community_to?.id) {
      return props.data.message.otm_id_community_to?.name;
    }
    return "";
  }

  const getMessageThumbnail = () => {
    const message_data = props.data.message.data;
    const attachment = props.data.list_attachment[0];
    if (message_data) {
      if (attachment && attachment.type !== AttachmentType.AUDIO) {
        return (
          <View className="flex-row items-center space-x-1">
            {attachment.type == AttachmentType.IMAGE ? (
              <Camera size={16} color="#888" />
            ) : attachment.type == AttachmentType.VIDEO ? (
              <Video size={16} color="#888" />
            ) : attachment.type == AttachmentType.FILE ? (
              <File size={16} color="#888" />
            ) : null}
            <Text className="text-neutral-700">{message_data}</Text>
          </View>
        );
      } else {
        return <Text className="text-neutral-700">{message_data}</Text>;
      }
    } else if (attachment) {
      return (
        <View className="flex-row items-center space-x-1">
          {attachment.type == AttachmentType.IMAGE ? (
            <Camera size={16} color="#888" />
          ) : attachment.type == AttachmentType.VIDEO ? (
            <Video size={16} color="#888" />
          ) : attachment.type == AttachmentType.FILE ? (
            <File size={16} color="#888" />
          ) : attachment.type == AttachmentType.AUDIO ? (
            <AudioLines size={16} color="#888" />
          ) : null}
          <Text className="text-neutral-700">{attachment.type}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.8}
      className="flex-row items-center gap-5 w-full px-4 py-4 border-b border-b-[#F5F5F5] bg-white"
    >
      <Image
        className="w-12 h-12 rounded-full bg-neutral-200"
        source={
          getThumbnail()
            ? { uri: getThumbnail() }
            : require("@/assets/icons/logo.png")
        }
      />
      <View className="flex-1 flex-col gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="font-medium text-base text-neutral-900">{getName()}</Text>
          <Text className="text-xs text-primary-main">
            {moment(props.data.message.ts).format("HH:mm")}
          </Text>
        </View>
        {getMessageThumbnail()}
      </View>
    </TouchableOpacity>
  );
}