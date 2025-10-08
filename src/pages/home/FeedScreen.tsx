import { FC, useCallback, useState } from "react"
import { ScrollView, Text, View, FlatList, RefreshControl, ToastAndroid, TouchableOpacity } from "react-native"
import Components from "../../components"
import Assets from "../../assets"
import { listPostingRequest, postingRequest } from "../../services/home/posting"
import { Schema } from "@pn/watch-is/driver"
import { useFocusEffect } from "@react-navigation/native"
import { PostingType } from "@pn/watch-is/model"
import { myProfileRequest } from "../../services/home/profile"
import { UserSummaryResponse } from "../../constants/interface"

interface FeedInterface {
  navigation: any,
  route: any
}

const Feed: FC<FeedInterface> = ({ navigation, route }) => {
  const { type } = route.params
  const [refreshing,] = useState(false)
  const [postStatus, setPostStatus] = useState("")
  const [postData, setPostData] = useState<Schema.GetResponsePostingBody["data"]>([])
  const [activeTab, setActiveTab] = useState(1)
  const [onScrolling, setOnScrolling] = useState(false)
  const [loadingListPost, setLoadingListPost] = useState(true)
  const [showPostImage, setShowPostImage] = useState(false)
  const [showPostVideo, setShowPostVideo] = useState(false)
  const [showPostProduct, setShowPostProduct] = useState(false)
  const [showModalComment, setShowModalComment] = useState(false)
  const [hashComment, setHashComment] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isEndPage, setIsEndPage] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  const myprofile = async () => {
    setLoading(true)
    try {
      const profile: UserSummaryResponse = await myProfileRequest()

      setIsVerified(profile.verified)
    } catch (error) {
      ToastAndroid.show("Gagal mengambil data profil !", ToastAndroid.SHORT)
    } finally {
      setLoading(false)
    }
  }


  const listPost = async (page = 1, isPagination = false) => {
    if (!isPagination) {
      setLoadingListPost(true)
    }

    try {
      const post = await listPostingRequest(type, page)
      if (post.data.length > 0) {
        if (!isPagination) {
          setPostData(post.data)

        } else {
          const combine = [...postData, ...post.data]
          setPostData(combine as Schema.GetResponsePostingBody["data"])
        }

      } else {
        setIsEndPage(true)
      }

    } catch (error) {
      ToastAndroid.show("Gagal mengambil data post !", ToastAndroid.SHORT)

    } finally {
      setLoadingListPost(false)
    }
  }

  const postText = async () => {
    setLoadingPost(true)
    try {
      await postingRequest(PostingType.PLAIN_TEXT, {
        text: postStatus
      })

      listPost()
      setPostStatus("")
      ToastAndroid.show("Berhasil posting !", ToastAndroid.SHORT)

    } catch (error) {
      ToastAndroid.show("Gagal posting !", ToastAndroid.SHORT)

    } finally {
      setLoadingPost(false)
    }
  }

  const postPhoto = async (imageUrl: string, caption: string) => {
    setLoadingPost(true)
    try {
      await postingRequest(PostingType.IMAGE_STATIC, {
        image_url: imageUrl,
        caption: caption
      })

      listPost()
      setShowPostImage(false)
      ToastAndroid.show("Berhasil posting !", ToastAndroid.SHORT)

    } catch (error) {
      ToastAndroid.show("Gagal posting !", ToastAndroid.SHORT)

    } finally {
      setLoadingPost(false)
    }
  }

  const postVideo = async (videoUrl: string, caption: string) => {
    setLoadingPost(true)
    try {
      await postingRequest(PostingType.VIDEO, {
        video_url: videoUrl,
        caption: caption
      })

      listPost()
      setShowPostVideo(false)
      ToastAndroid.show("Berhasil posting !", ToastAndroid.SHORT)

    } catch (error) {
      ToastAndroid.show("Gagal posting !", ToastAndroid.SHORT)
    } finally {
      setLoadingPost(false)
    }
  }

  const postProduct = async (
    url: [{ image_url: string }],
    data: { location: string; jenis: boolean; category: string; name: string; description: string; price: string; kuantitas: string }
  ) => {
    setLoadingPost(true)
    try {
      await postingRequest(PostingType.SELL_PRODUCT, {
        id_product_category: data.category,
        name: data.name,
        price: data.price,
        description: data.description,
        is_new_product: data.jenis,
        location: data.location,
        quantity: data.kuantitas,
        images: url
      })

      listPost()
      setShowPostProduct(false)
      ToastAndroid.show("Berhasil posting !", ToastAndroid.SHORT)

    } catch (error) {
      ToastAndroid.show("Gagal posting !", ToastAndroid.SHORT)

    } finally {
      setLoadingPost(false)
    }
  }

  const handlePagination = () => {
    const plusOnePage = currentPage + 1
    setCurrentPage(plusOnePage)
    listPost(plusOnePage, true)
  }

  const openModalComment = (hash: string) => {
    setHashComment(hash)
    setShowModalComment(true)
  }

  useFocusEffect(
    useCallback(() => {

      listPost()
      myprofile()

      return () => {
        setCurrentPage(1)
        setShowBanner(true)
      }
    }, [])
  )

  return (
    <View className="flex-1 bg-gray-100">
      {
        type === "" &&
        !onScrolling &&
        <View className="bg-white my-1 p-4">
          {
            (type === "") && (
              <View className="flex-row items-center">
                <View className="flex-1"
                  id="input-posting"
                >
                  <Components.FormInput
                    customHeight={45}
                    isBackground={true}
                    placeholder="Apa yang sedang kamu lakukan ?"
                    value={postStatus}
                    onChange={setPostStatus}
                  />
                </View>
                <TouchableOpacity className="pl-3" onPress={() => postText()}>
                  <Assets.IconSend width={30} height={30} />
                </TouchableOpacity>
              </View>
            )
          }

          {
            type === "" && (
              <View className="mt-3 flex-row justify-start items-start">
                {
                  (type === "") &&
                  <View className="p-1">
                    <Components.Badge
                      icon={
                        <View>
                          <Assets.IconGalleryBlue width={15} height={15} />
                        </View>
                      }
                      label="Foto"
                      onPress={() => {
                        setShowPostImage(true)
                      }}
                      backgroundColor="bg-blue_color/10"
                      textColor="text-blue_color"
                    />
                  </View>
                }

                {
                  (type === "") &&
                  <View className="p-1">
                    <Components.Badge
                      icon={
                        <View>
                          <Assets.IconVideoGreen width={15} height={15} />
                        </View>
                      }
                      label="Video"
                      onPress={() => {
                        setShowPostVideo(true)
                      }}
                      backgroundColor="bg-success/10"
                      textColor="text-success"
                    />
                  </View>
                }

                {
                  (type === "") &&
                  <View className="p-1">
                    <Components.Badge
                      icon={
                        <View>
                          <Assets.IconShopOrange width={15} height={15} />
                        </View>
                      }
                      label="Jual Produk"
                      onPress={() => {
                        setShowPostProduct(true)
                      }}
                      backgroundColor="bg-orange_color/10"
                      textColor="text-orange_color"
                    />
                  </View>
                }

              </View>
            )
          }
        </View>
      }

      {
        !loading && showBanner && !isVerified &&
        <View>
          <Components.JadabBanner closeBanner={(e) => {
            setShowBanner(e)
          }} />
        </View>
      }

      <View className="flex-1">
        {
          loadingListPost ?
            <ScrollView showsVerticalScrollIndicator={false}>
              {
                [...Array(10)].map((e, i) => (
                  <View key={i} className="mx-4 my-1 bg-gray-200 rounded-md animate-pulse h-[300px]">
                  </View>
                ))
              }
            </ScrollView>
            :
            postData.length > 0 ?
              <FlatList
                onStartReached={() => { setOnScrolling(false) }}
                onScrollEndDrag={() => { setOnScrolling(true) }}
                removeClippedSubviews
                initialNumToRender={5}
                data={postData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={listPost} />}
                renderItem={({ item, index }) => {
                  return (
                    <Components.ListPost
                      key={index}
                      dataPost={item}
                      listPost={listPost}
                      onPressComment={openModalComment}
                    />
                  )
                }}
                onEndReached={handlePagination}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => (
                  <Components.LoadMore isEndPages={isEndPage} label="Memuat posting ..." />
                )}
              />
              :
              <View className="justify-center items-center flex-1">
                <Text className="font-satoshi font-medium text-primary">Belum ada postingan !</Text>
              </View>
        }
      </View>

      <Components.ModalsPostPhoto
        isShow={showPostImage}
        handleClose={setShowPostImage}
        onPost={postPhoto}
        loading={loadingPost}
      />

      <Components.ModalsPostVideo
        isShow={showPostVideo}
        handleClose={setShowPostVideo}
        onPost={postVideo}
        loading={loadingPost}
      />

      <Components.ModalsPostProduct
        isShow={showPostProduct}
        handleClose={setShowPostProduct}
        onPost={postProduct}
        loading={loadingPost}
      />

      <Components.ModalsComment
        isShow={showModalComment}
        hash={hashComment}
        handleClose={setShowModalComment}
      />
    </View>
  )
}

export default Feed