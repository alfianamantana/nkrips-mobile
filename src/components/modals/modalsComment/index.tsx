import { View, Text, TouchableOpacity, Image, ToastAndroid, FlatList, RefreshControl, ActivityIndicator, TouchableWithoutFeedback } from "react-native"
import { FC, Fragment, useEffect, useState } from "react"
import ContainerModalsBottom from "../../modalsContainerBottom"
import FormInput from "../../formInput"
import Assets from "../../../assets"
import { listCommentRequest, postCommentRequest } from "../../../services/home/posting"
import { Comment } from "@pn/watch-is/model"
import moment from "moment-timezone"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../../../tailwind.config"

const { theme } = resolveConfig(tailwindConfig)

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

interface ModalsCommentInterface {
    isShow: boolean,
    handleClose: (value: boolean) => void
    hash: string
}

const ModalsComment: FC<ModalsCommentInterface> = ({ isShow, handleClose, hash }) => {
    const [refreshing,] = useState(false)
    const [comment, setComment] = useState("")
    const [dataComment, setDataComment] = useState<Comment[]>([])
    const [totalComment, setTotalComment] = useState(0)
    const [loadingComment, setLoadingComment] = useState(true)

    const handleShowHideModals = () => {
        handleClose(false)
    }

    const getComment = async () => {
        setLoadingComment(true)
        try {
            const comment = await listCommentRequest(hash)

            setDataComment(comment.data)
            setTotalComment(comment.total)

        } catch (error) {
            ToastAndroid.show("Gagal mengambil data komentar", ToastAndroid.SHORT)

        } finally {
            setLoadingComment(false)
        }
    }

    const postComment = async () => {
        try {
            await postCommentRequest(hash, comment)
            ToastAndroid.show("Sukses mengirim komentar", ToastAndroid.SHORT)

            getComment()
            setComment("")

        } catch (error) {
            ToastAndroid.show("Gagal mengirim komentar", ToastAndroid.SHORT)
        }
    }

    useEffect(() => {

        if (isShow) {
            getComment()
        }

    }, [isShow])

    return (
        <ContainerModalsBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
            <View className="pb-1 h-[70vh]">
                <View>
                    <Text className="font-satoshi text-black font-medium">
                        {totalComment > 0 ? totalComment : ""} Komentar
                    </Text>
                </View>
                <View className="flex-1 pt-4">
                    {
                        loadingComment ?
                            <View className="justify-center items-center flex-1 flex-row">
                                <View className="mr-2">
                                    <ActivityIndicator size="small" color={theme?.colors!["Primary/Main"] as string} />
                                </View>
                                <View>
                                    <Text className="font-satoshi font-medium text-primary">Memuat Komentar ...</Text>
                                </View>
                            </View>
                            :
                            dataComment.length > 0 ?
                                <FlatList
                                    removeClippedSubviews
                                    initialNumToRender={5}
                                    data={dataComment}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getComment} />}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableWithoutFeedback key={index}>
                                                <View className="flex-row my-2">
                                                    <View className="pr-2">
                                                        {
                                                            item?.otm_id_user?.profile_picture_url !== null ?
                                                                <Image source={{ uri: item?.otm_id_user?.profile_picture_url }} width={40} height={40} className="rounded-full" />
                                                                :
                                                                <Assets.ImageEmptyProfile width={40} height={40} />
                                                        }
                                                    </View>
                                                    <View className="flex-1 bg-Neutral/20 rounded-lg p-3">
                                                        <View>
                                                            <Text className="font-medium font-satoshi text-Neutral/90">{item?.otm_id_user?.name}</Text>
                                                        </View>
                                                        <View className="mt-1">
                                                            <Text className="font-satoshi text-Neutral/70">{item?.content}</Text>
                                                        </View>
                                                        <View className="mt-1 items-end">
                                                            <Text className="font-satoshi text-Neutral/60 text-xs">{moment(item?.created_at).fromNow()}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    }}
                                    // onEndReached={handlePagination}
                                    onEndReachedThreshold={0.5}
                                    ListFooterComponent={() => (
                                        <Fragment>
                                            {/* {
                                                pagesManager.page < pagesManager.totalPages &&
                                                <Components.LoadMore/>
                                            } */}
                                        </Fragment>
                                    )}
                                />
                                :
                                <View className="justify-center items-center flex-1">
                                    <Text className="font-satoshi font-medium text-primary">Belum ada komentar !</Text>
                                </View>
                    }
                </View>
                <View className="border-t border-t-gray-200 pt-4 flex-row items-center">
                    <View className="pr-2">
                        <Assets.ImageEmptyProfile width={40} height={40} />
                    </View>
                    <View className="flex-1">
                        <FormInput
                            isBackground={true}
                            placeholder="Ketik komentar"
                            value={comment}
                            onChange={setComment}
                        />
                    </View>
                    <TouchableOpacity onPress={() => postComment()} className="pl-3">
                        <Assets.IconSend width={25} height={25} />
                    </TouchableOpacity>
                </View>
            </View>
        </ContainerModalsBottom>
    )
}

export default ModalsComment