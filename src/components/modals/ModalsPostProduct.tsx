import { View, Text, TouchableOpacity, Platform, ToastAndroid, ScrollView, Image } from "react-native"
import { Component, FC, useEffect, useState } from "react"
import Button from "../button"
import Assets from "../../assets"
import ImagePicker from 'react-native-image-crop-picker';
import { uploadFile } from "../../helpers/uploadFile"
import ModalsChoseImageFrom from "./modalsSelectImages"
import Components from "../index"

interface ModalsPostProductInterface {
  isShow: boolean,
  handleClose: (value: boolean) => void
  onPost: (videoUrl: string, desc: string) => void,
  loading: boolean
}

const ModalsPostProduct: FC<ModalsPostProductInterface> = ({ isShow, handleClose, onPost, loading }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Array<{ image_url: "" }>>([])
  const [selectedJenis, setSelectedJenis] = useState({ value: 0, label: "" })
  const [selectedCategory, setSelectedCategory] = useState({ value: 0, label: "" })
  const [namaProduk, setnamaProduk] = useState("")
  const [kategori, setkategori] = useState("")
  const [jenis, setjenis] = useState("")
  const [desc, setdesc] = useState("")
  const [price, setprice] = useState("")
  const [location, setlocation] = useState("")
  const [kuantitas, setkuantitas] = useState("")
  const [showModalsSelectImage, setShowSelectImage] = useState(false)
  const [showSelectJenis, setShowSelectJenis] = useState(false)
  const [showSelectCategory, setShowSelectCategory] = useState(false)

  const handleShowHideModals = () => {
    handleClose(false)
    setkategori("")
    setjenis("")
    setSelectedCategory({ value: 0, label: "" })
    setSelectedJenis({ value: 0, label: "" })
    setSelectedPhoto([])
    setnamaProduk("")
    setdesc("")
    setprice("")
    setlocation("")
    setkuantitas("")
  }

  const uploadImage = async (image: any) => {
    try {
      const { data } = await uploadFile(image.path, image.mime);
      return data; // url string
    } catch (error) {
      ToastAndroid.show("Gagal melakukan upload !", ToastAndroid.SHORT)
      return "";
    }
  }

  const choseImageCamera = async () => {
    ImagePicker.openCamera({
      mediaType: "photo"
    }).then(async (image: any) => {
      setShowSelectImage(false)
      const url = await uploadImage(image)
      if (url) {
        setSelectedPhoto(prev => [...prev, { image_url: url }])
      } else {
        ToastAndroid.show("Gagal upload foto!", ToastAndroid.SHORT)
      }
    }).catch(() => {
      ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
    });
  }


  const choseImageExplorer = async () => {
    ImagePicker.openPicker({
      mediaType: "photo"
    }).then(async (image: any) => {
      setShowSelectImage(false)
      const url = await uploadImage(image)
      if (url) {
        setSelectedPhoto(prev => [...prev, { image_url: url }])
      } else {
        ToastAndroid.show("Gagal upload foto!", ToastAndroid.SHORT)
      }
    }).catch(() => {
      ToastAndroid.show("Batal mengambil foto !", ToastAndroid.SHORT)
    });
  }

  const deleteImageList = (valueLink: string) => {
    let dataImage = selectedPhoto
    let dataUndeleted = []

    if (dataImage.length > 0) {
      for (let i = 0; i < dataImage.length; i++) {
        if (dataImage[i].image_url !== valueLink) {
          dataUndeleted.push(dataImage[i])
        }
      }
    }

    setSelectedPhoto(dataUndeleted)
  }

  const postProduct = async () => {
    if (
      !namaProduk.trim() ||
      !selectedCategory.value ||
      !selectedJenis.value ||
      !desc.trim() ||
      !price.trim() ||
      !location.trim() ||
      !kuantitas.trim() ||
      selectedPhoto.length === 0
    ) {
      ToastAndroid.show("Semua data harus diisi!", ToastAndroid.SHORT)
      return;
    }
    if (selectedPhoto.length > 0) {
      let data = {
        name: namaProduk,
        category: selectedCategory.value,
        jenis: selectedJenis.value === 0 ? true : false,
        description: desc,
        price,
        location,
        kuantitas,
        images: selectedPhoto
      }

      onPost(selectedPhoto, data)
      setSelectedCategory({ value: 0, label: "" })
      setSelectedJenis({ value: 0, label: "" })
      setkategori("")
      setjenis("")
      setnamaProduk("")
      setdesc("")
      setprice("")
      setlocation("")
      setkuantitas("")
      setSelectedPhoto([])
    } else {
      ToastAndroid.show("Foto tidak boleh kosong !", ToastAndroid.SHORT)
    }
  }

  return (
    <Components.ModalContainerBottom isShow={isShow} handleClose={handleShowHideModals} isFullWidth={true} isBottom={true}>
      <View className="px-2 pt-4 pb-1 h-[70vh]">
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="my-2">
              <Components.FormInput
                label="Nama Produk"
                placeholder="Masukan nama produk"
                onChange={setnamaProduk}
                value={namaProduk}
              />
            </View>
            <View className="my-2">
              <View>
                <View>
                  <Text className="text-sm text-black font-satoshi">Tambahkan foto produk</Text>
                </View>
                <View className="mt-4">
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View className="flex-row items-center">
                      {
                        selectedPhoto.length > 0 &&
                        selectedPhoto.map((img, i) => (
                          <View key={i} className="w-[100px] h-[100px] items-center border border-Neutral/40 rounded-lg mr-2 relative">
                            <Image source={{ uri: img.image_url }} resizeMode="cover" width={100} height={100} className="rounded-lg" />

                            <TouchableOpacity onPress={() => deleteImageList(img.image_url)} className="bg-Neutral/90/70 absolute top-0 left-0 h-[100px] w-[100px] items-center justify-center rounded-lg">
                              <Assets.IconTrashRed width={20} height={20} />
                            </TouchableOpacity>
                          </View>
                        ))
                      }

                      <TouchableOpacity onPress={() => setShowSelectImage(true)} className="w-[100px] h-[100px] items-center justify-center border border-Neutral/40 rounded-lg p-3 mr-2">
                        <View>
                          <Assets.IconGallery width={25} height={25} />
                        </View>
                        <View className="mt-2">
                          <Text className="text-xs text-Neutral/90 font-satoshi">
                            Pilih Foto
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
            <View className="my-2">
              <Components.FormInput
                label="Kategori"
                placeholder="Pilih kategori"
                onChange={setkategori}
                value={selectedCategory.label}
                sufix={
                  <View className={`${!showSelectCategory ? "-rotate-90" : "rotate-90"}`}>
                    <Assets.IconArrowBack width={20} height={20} />
                  </View>
                }
                onPres={() => {
                  setShowSelectCategory(!showSelectCategory)
                }}
              />
            </View>
            <View className="my-2">
              <Components.FormInput
                label="Jenis"
                placeholder="Pilih Jenis"
                onChange={setjenis}
                value={selectedJenis.label}
                sufix={
                  <View className={`${!showSelectJenis ? "-rotate-90" : "rotate-90"}`}>
                    <Assets.IconArrowBack width={20} height={20} />
                  </View>
                }
                onPres={() => {
                  setShowSelectJenis(!showSelectJenis)
                }}
              />
            </View>
            <View className="my-2">
              <Components.FormInput
                label="Deskripsi"
                isMultiLine={true}
                placeholder="Masukan deskripsi"
                onChange={setdesc}
                value={desc}
              />
            </View>
            <View className="my-2">
              <Components.FormInput
                label="Harga"
                inputType="number"
                placeholder="Masukan harga"
                onChange={setprice}
                value={price}
              />
            </View>
            <View className="my-2">
              <Components.FormInput
                label="Lokasi"
                placeholder="Masukan lokasi"
                onChange={setlocation}
                value={location}
              />
            </View>
            <View className="my-2">
              <Components.FormInput
                label="Kuantitas"
                inputType="number"
                keyboardType="numeric"
                placeholder="Masukan kuantitas"
                onChange={setkuantitas}
                value={kuantitas}
              />
            </View>
          </ScrollView>
        </View>
        <View className="mt-5">
          <Button
            loading={loading}
            label="Posting"
            onPress={postProduct}
          />
        </View>
      </View>

      {
        showModalsSelectImage &&
        <ModalsChoseImageFrom
          isShow={showModalsSelectImage}
          handleClose={() => {
            setShowSelectImage(false)
          }}
          fromCamera={choseImageCamera}
          fromFileExplorer={choseImageExplorer}
        />
      }

      {/* modals jenis */}
      <Components.ModalsSelectJenis
        isShow={showSelectJenis}
        handleShowHideModals={() => {
          setShowSelectJenis(!showSelectJenis)
        }}
        handleSelected={(value: number, label: string) => {
          setSelectedJenis({
            value: value,
            label: label
          })
          setShowSelectJenis(false)
        }}
      />

      {/* modals kategori */}
      <Components.ModalsSelectCategory
        isShow={showSelectCategory}
        handleShowHideModals={() => {
          setShowSelectCategory(!showSelectCategory)
        }}
        handleSelected={(value: number, label: string) => {
          setSelectedCategory({
            value: value,
            label: label
          })
          setShowSelectCategory(false)
        }}
      />
    </Components.ModalContainerBottom>
  )
}

export default ModalsPostProduct