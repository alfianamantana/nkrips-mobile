import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Dimensions } from "react-native";
import Assets from "../../assets";
import { PostingType, VoteType } from "@pn/watch-is/model";
import { getVoteRequest, voteRequest } from "../../services/home/posting";
import VideoPlayer from 'react-native-video-controls';
import AutoHeightImage from 'react-native-auto-height-image';
import Components from "../../components";

interface DetailPostScreenProps {
  route: any;
  navigation: any;
}

const DetailPostScreen: React.FC<DetailPostScreenProps> = ({ route, navigation }) => {
  const { public_hash } = route.params;
  const [vote, setVote] = useState({ "downvote": 0, "upvote": 0 });
  const [showModalsComment, setShowModalsComment] = useState({ public_hash: "", status: false });
  const [post, setPost] = useState<any>({});
  const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>({});

  const voteData = async () => {
    try {
      const dataVote = await getVoteRequest(public_hash);
      console.log(dataVote, 'dataVotedataVote');

      setVote(dataVote);
    } catch (error) {
      console.log("Failed Get VOTE ! ", error);
    }
  };

  const pressVote = async (type: VoteType) => {
    try {
      await voteRequest(public_hash, type);
      voteData();
    } catch (error) {
      ToastAndroid.show("Gagal melakukan vote !", ToastAndroid.SHORT);
    }
  };

  const fetchPost = async () => {
    try {
      const { data } = await require("../../services/api").api({
        url: `/posting/${public_hash}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      setPost(data);
    } catch (error) {
      ToastAndroid.show("Gagal memuat data !", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchPost();
    voteData();
  }, []);

  // Render posting sesuai tipe
  const renderContent = () => {
    if (!post.posting) return null;

    // IMAGE_STATIC
    if (post.posting.type === PostingType.IMAGE_STATIC && post.list_image_static?.length > 0) {
      return post.list_image_static.map((postImage: any, idx: number) => (
        <View key={idx}>
          {postImage.caption !== "" && (
            <View className="mb-2">
              <Text className="text-lg font-bold text-neutral-800">{postImage.caption}</Text>
            </View>
          )}
          <AutoHeightImage
            width={Dimensions.get('window').width - 30}
            source={{ uri: postImage.image_url }}
            style={{ borderRadius: 12, backgroundColor: "#f4f4f4" }}
          />
        </View>
      ));
    }

    // VIDEO
    if (post.posting.type === PostingType.VIDEO && post.list_video?.length > 0) {
      return post.list_video.map((postVideo: any, idx: number) => (
        <View key={idx}>
          {postVideo.caption !== "" && (
            <View className="mb-2">
              <Text className="text-lg font-bold text-neutral-800">{postVideo.caption}</Text>
            </View>
          )}
          <VideoPlayer
            autoPlay={false}
            showOnStart={false}
            paused={true}
            source={{ uri: postVideo.video_url }}
            style={{ borderRadius: 12, backgroundColor: "#f4f4f4", height: 305 }}
          />
        </View>
      ));
    }

    // PLAIN_TEXT
    if (post.posting.type === PostingType.PLAIN_TEXT && post.list_plain_text?.length > 0) {
      return post.list_plain_text.map((postText: any, idx: number) => (
        <View key={idx} className="my-2">
          <Text className="text-base text-neutral-700">{postText.content}</Text>
        </View>
      ));
    }

    // SELL_PRODUCT
    if (post.posting.type === PostingType.SELL_PRODUCT && post.list_sell_product?.length > 0) {
      return post.list_sell_product.map((postSell: any, p: number) => {
        console.log(post, 'list_sell_productlist_sell_product');

        const images = postSell?.list_images || [];
        const totalImages = images.length;
        const imageIndex = imageIndexes[p] || 0;

        const handlePrev = () => {
          setImageIndexes(prev => ({
            ...prev,
            [p]: imageIndex === 0 ? totalImages - 1 : imageIndex - 1
          }));
        };

        const handleNext = () => {
          setImageIndexes(prev => ({
            ...prev,
            [p]: imageIndex === totalImages - 1 ? 0 : imageIndex + 1
          }));
        };

        return (
          <View key={p}>
            {totalImages > 0 && (
              <View>
                <AutoHeightImage
                  width={Dimensions.get('window').width - 30}
                  source={{ uri: images[imageIndex].image_url }}
                  style={{ borderRadius: 12, backgroundColor: "#f4f4f4" }}
                />
                {totalImages > 1 && (
                  <View className="flex-row justify-center items-center mt-2 gap-4">
                    <TouchableOpacity onPress={handlePrev} className="bg-gray-100 rounded-full p-2">
                      <Text className="text-lg text-neutral-800">‹</Text>
                    </TouchableOpacity>
                    <Text className="text-neutral-800">{imageIndex + 1} / {totalImages}</Text>
                    <TouchableOpacity onPress={handleNext} className="bg-gray-100 rounded-full p-2">
                      <Text className="text-lg text-neutral-800">›</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            <View className="my-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-neutral-800">{postSell?.posting_product.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("DetailChat", {
                  isComunity: false,
                  public_hash: post.posting?.otm_id_user.public_hash,
                  text: `Halo saya tertarik dengan barang ini, apakah masih ada? [Lihat detail barang](nkrips://post/${public_hash})`
                })}
                  className="flex-row items-center mt-1 bg-blue-500 rounded-xl px-3 py-2 gap-x-2">
                  <View>
                    <Assets.IconChat
                      className="text-white" width={20} height={20} />
                  </View>
                  <Text className="text-sm text-white">Chat Penjual</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-base font-bold text-blue-600">Rp {postSell?.posting_product.price?.toLocaleString()}</Text>
              <Text className="text-sm text-neutral-600">{postSell?.posting_product.location}</Text>
              <Text className="text-xs text-white bg-blue-600 rounded-full px-3 py-1 self-start mt-1">{postSell?.posting_product.is_new_product ? "Baru" : "Bekas"}</Text>
              <Text className="text-xs text-white bg-yellow-400 rounded-full px-3 py-1 self-start mt-1">{postSell?.posting_product.quantity} stok tersedia</Text>
              <Text className="text-base text-neutral-700 mt-2">{postSell?.posting_product.description}</Text>
            </View>
          </View>
        );
      });
    }

    return null;
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-2">
      {renderContent()}
      <View className="flex-row mt-4">
        <View className="flex-1 flex-row items-center">
          <View className="pr-2">
            <TouchableOpacity onPress={() => pressVote(VoteType.UP)} className="bg-red-600 flex-row items-center rounded-lg h-8 min-w-[30px] px-3">
              <View className="pr-1">
                <Assets.IconArrowTopWhite width={15} height={15} />
              </View>
              <Text className="text-white font-bold text-sm">{vote.upvote}</Text>
            </TouchableOpacity>
          </View>
          <View className="pr-2">
            <TouchableOpacity onPress={() => pressVote(VoteType.DOWN)} className="bg-gray-100 flex-row items-center rounded-lg h-8 min-w-[30px] px-3">
              <View className="pr-1">
                <Assets.IconArrowDown width={15} height={15} />
              </View>
              <Text className="text-black font-bold text-sm">{vote.downvote}</Text>

            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          disabled={showModalsComment.status}
          onPress={() => setShowModalsComment({ public_hash, status: true })} className="flex-1 flex-row items-center justify-end">
          <Text className="text-neutral-600 text-sm">{post?.list_comment?.length} Komentar</Text>
          <View className="pl-2">
            <Assets.IconArrowBack style={{ transform: [{ rotate: "90deg" }] }} width={10} height={10} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal komentar */}
      <Components.ModalsComment
        isShow={showModalsComment.status}
        hash={showModalsComment.public_hash}
        handleClose={(value: boolean) => setShowModalsComment({ public_hash: "", status: value })}
      />
    </ScrollView>
  );
}

export default DetailPostScreen;