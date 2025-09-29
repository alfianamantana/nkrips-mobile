import { useNavigation } from "@react-navigation/native"
import { View, TouchableOpacity, Image, Text, ToastAndroid, Dimensions, ActivityIndicator } from "react-native"
import Assets from "../assets"
import { Posting, VoteType } from "@pn/watch-is/model"
import { FC, useEffect, useState } from "react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../routes"
type PostProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostProfile'>;
import { PostingType } from "@pn/watch-is/model"
import { formatCurrency } from "react-native-format-currency";
import Badge from "./badge"
import VideoPlayer from 'react-native-video-controls';
import moment from "moment-timezone"
import { getVoteRequest, voteRequest } from "../services/home/posting"
import { storeShowModalsComment } from "../store"
import AutoHeightImage from 'react-native-auto-height-image';
import ContextMenu from "react-native-context-menu-view"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASE_URL } from "@env";
import axios from "axios"


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
  posting: Posting;
}

moment.updateLocale('en', {
  relativeTime: {
    future: 'dalam %s',
    past: '%s yang lalu',
    s: 'beberapa detik',
    m: 'semenit',
    mm: '%d menit',
    h: 'sejam',
    hh: '%d jam',
    d: 'sehari',
    dd: '%d hari',
    M: 'sebulan',
    MM: '%d bulan',
    y: 'setahun',
    yy: '%d tahun'
  }
});

interface ListPostInterface {
  dataPost: Posting
  listPost: () => void
}

const ListPost: FC<ListPostInterface> = ({ dataPost, listPost }) => {
  const navigation = useNavigation<PostProfileNavigationProp>()
  const [vote, setVote] = useState({ "downvote": 0, "upvote": 0 })
  const { showModalsComment, setShowModalsComment } = storeShowModalsComment()
  let [contextActions, setContextActions] = useState<Array<{ title: string }>>([{ title: "Hapus" }])
  let [isloading, setIsloading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const voteData = async () => {
    try {
      if (dataPost.posting.type === PostingType.PLAIN_TEXT) {

      }
      const dataVote = await getVoteRequest(dataPost?.posting?.hash)
      setVote(dataVote)

    } catch (error) {
      console.log("Failed Get VOTE ! ", error);

    }
  }

  const pressVote = async (type: VoteType) => {
    try {
      await voteRequest(dataPost?.posting?.hash, type)
      voteData()

    } catch (error) {
      ToastAndroid.show("Gagal melakukan vote !", ToastAndroid.SHORT)
    }
  }

  async function fetchUser() {
    const user: string | null = await AsyncStorage.getItem("user")

    if (user !== null) {
      const parseUser: User = JSON.parse(user)
      setUser(parseUser)
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      setIsloading(true)
      await voteData()
      await fetchUser()
      setIsloading(false)
    }
    fetchAll()
  }, [])

  const handleDeletePost = async () => {
    try {
      await axios({
        url: `${BASE_URL}/posting/${dataPost?.posting?.hash}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
        }
      })
      ToastAndroid.show("Berhasil menghapus postingan", ToastAndroid.SHORT)
      listPost()
      // navigation.navigate("Home", { screen: "Feed" })
    } catch (err) {
      ToastAndroid.show("Gagal menghapus postingan", ToastAndroid.SHORT)
    }
  }

  const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>({});


  if (isloading) {
    return <View className="flex-1 items-center justify-center w-full h-72">
      <ActivityIndicator size="large" color="red" />
    </View>
  }



  return (
    <View className="my-1 bg-white p-4">
      <View className="flex-row items-center">
        <TouchableOpacity
          className="flex-row items-center w-10/12"
          onPress={() =>
            navigation.navigate("PostProfile", { username: dataPost?.posting.otm_id_user.username! })
          }>
          <View className="pr-3">
            {
              dataPost?.posting?.otm_id_user?.profile_picture_url !== null ?
                <Image resizeMode="contain" source={{ uri: dataPost?.posting?.otm_id_user?.profile_picture_url }} className="w-[50px] h-[50px] rounded-full" />
                :
                <Assets.ImageEmptyProfile width={50} height={50} />
            }
          </View>
          <View className="flex-1">
            <View>
              <Text className="font-satoshi text-black font-medium">{dataPost?.posting?.otm_id_user?.name}</Text>
              <View>
                {/* <Assets.Image */}
              </View>
            </View>
            <View className="mt-1">
              <Text className="font-satoshi text-xs text-gray-400">{moment(dataPost?.posting?.created_at).fromNow()}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {
          dataPost?.posting?.otm_id_user?.id === user?.id && (
            <ContextMenu
              actions={contextActions}
              onPress={(e) => {
                const action = e.nativeEvent.name;
                if (action === "Hapus") {
                  handleDeletePost()
                }
              }}
              dropdownMenuMode={true}
            >
              <TouchableOpacity id="more-button" className="justify-end items-end p-10">
                <Assets.IconMore width={16} height={16} />
              </TouchableOpacity>
            </ContextMenu>
          )
        }
      </View>

      <View className="my-4">
        {
          dataPost.posting.type === PostingType.IMAGE_STATIC &&
          <View className="my-1">
            {
              dataPost.list_image_static?.length > 0 &&
              dataPost.list_image_static.map((postImage, p) => {

                return (
                  <View key={p}>
                    {
                      postImage.caption !== "" &&
                      <View className="mb-2">
                        <Text className="font-satoshi text-black">{postImage.caption}</Text>
                      </View>
                    }

                    <View>
                      <AutoHeightImage
                        key={p}
                        width={Dimensions.get('window').width - 30}
                        source={{ uri: postImage.image_url }}
                        className="my-1 bg-gray-100 rounded-lg"
                      />
                    </View>
                  </View>
                )
              }
              )
            }
          </View>
        }

        {
          dataPost.posting.type === PostingType.VIDEO &&
          <View className="my-1">
            {
              dataPost.list_video?.length > 0 &&
              dataPost.list_video.map((postVideo, p) => (
                <View key={p}>
                  {
                    postVideo.caption !== "" &&
                    <View className="mb-2">
                      <Text className="font-satoshi text-black">{postVideo.caption}</Text>
                    </View>
                  }

                  <VideoPlayer
                    autoPlay={false}
                    showOnStart={false}
                    paused={true}
                    source={{ uri: postVideo.video_url }}
                    className="my-1 bg-gray-100 rounded-lg h-[305px]"
                  />
                </View>
              ))
            }
          </View>
        }

        {
          dataPost.posting.type === PostingType.PLAIN_TEXT &&
          <View className="my-1">
            {
              dataPost.list_plain_text?.length > 0 &&
              dataPost.list_plain_text.map((postText, p) => (
                <View key={p} className="my-1">
                  <Text className="font-satoshi text-black">{postText.content}</Text>
                </View>
              ))
            }
          </View>
        }

        {
          dataPost.posting.type === PostingType.SELL_PRODUCT &&
          <View className="my-1">
            {
              dataPost.list_sell_product?.length > 0 &&
              dataPost.list_sell_product.map((postSell, p) => {

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
                          className="my-1 bg-gray-100 rounded-lg"
                        />
                        {totalImages > 1 && (
                          <View className="flex-row justify-center items-center mt-2 space-x-4">
                            <TouchableOpacity
                              onPress={handlePrev}
                              style={{
                                padding: 8,
                                backgroundColor: "#f3f4f6",
                                borderRadius: 20,
                              }}
                            >
                              <Text style={{ fontSize: 18, color: "#222" }}>{"‹"}</Text>
                            </TouchableOpacity>
                            <Text style={{ color: "#222" }}>{imageIndex + 1} / {totalImages}</Text>
                            <TouchableOpacity
                              onPress={handleNext}
                              style={{
                                padding: 8,
                                backgroundColor: "#f3f4f6",
                                borderRadius: 20,
                              }}
                            >
                              <Text style={{ fontSize: 18, color: "#222" }}>{"›"}</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}

                    {
                      postSell?.posting_product.name !== "" &&
                      <View className="my-2">
                        {/* ...lanjutan detail produk seperti sebelumnya... */}
                        <View>
                          <Text className="font-satoshi text-black text-sm">{postSell?.posting_product.name}</Text>
                        </View>
                        <View className="my-2">
                          <Text className="font-satoshi text-Primary/Main text-lg font-semibold">{formatCurrency({ amount: postSell?.posting_product.price, code: "IDR" })[0]}</Text>
                        </View>
                        <View className="mb-2 mt-1">
                          <View className="w-4/12">
                            <Badge
                              onPress={() => {
                                navigation.navigate("DetailPost", {
                                  isComunity: false,
                                  public_hash: dataPost?.posting?.hash,
                                })
                              }}
                              backgroundColor="bg-Primary/Main/10"
                              textColor="text-Primary/Main"
                              label="Lihat detail"
                            />
                          </View>
                        </View>
                        <View>
                          <Text className="font-satoshi text-gray-600">{postSell?.posting_product.description}</Text>
                        </View>
                      </View>
                    }
                  </View>
                )
              }
              )
            }
          </View>
        }
      </View>
      <View className="flex-row">
        <View className="flex-1 flex-row items-center">
          <View className="pr-2">
            <TouchableOpacity onPress={() => pressVote(VoteType.UP)} className="bg-Primary/Main flex-row items-center justify-center rounded-lg h-[30px] min-w-[30px] px-3">
              <View className="pr-1">
                <Assets.IconArrowTopWhite width={15} height={15} />
              </View>
              <View>
                <Text className="font-satoshi text-white font-medium text-xs">
                  {
                    vote.upvote
                  }
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="pr-1">
            <TouchableOpacity onPress={() => pressVote(VoteType.DOWN)} className="bg-gray-100 flex-row items-center justify-center rounded-lg h-[30px] min-w-[30px] px-3">
              <View className="pr-1">
                <Assets.IconArrowDown width={15} height={15} />
              </View>

              <View>
                <Text className="font-satoshi text-black font-medium text-xs">
                  {
                    vote.downvote
                  }
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowModalsComment(dataPost?.posting?.hash, true)} className="flex-1 flex-row items-center justify-end">
          <View>
            <Text className="font-satoshi text-gray-600 text-xs">{dataPost?.list_comment?.length} Komentar</Text>
          </View>
          <View className={`${!showModalsComment.status ? "pr-2 rotate-180" : "pl-2"}`}>
            <Assets.IconArrowBack className="rotate-90" width={10} height={10} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ListPost