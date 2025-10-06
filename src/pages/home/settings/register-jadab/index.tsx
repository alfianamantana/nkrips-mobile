import { FC, useCallback, useState } from "react"
import { Image, Platform, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import Components from "../../../../components"
import Assets from "../../../../assets"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../../../../tailwind.config"
import { getRegisterJadabRequest, postRegisterTahap1Request, postRegisterTahap2Request, postRegisterTahap3Request } from "../../../../services/home/registerJadab"
import { useFocusEffect } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import moment from "moment-timezone"
import ImagePicker from 'react-native-image-crop-picker';
import { uploadFile } from "../../../../helpers/uploadFile"

const { theme } = resolveConfig(tailwindConfig)

interface RegisterJadabInterface {
    navigation: any
}

const RegisterJadab: FC<RegisterJadabInterface> = ({ navigation }) => {
    const [showModalsSelectImage, setShowSelectImage] = useState(false)
    const [loadingCheckRegister, setLoadingCheckRegister] = useState(true)
    const [activeTab, setActiveTab] = useState(0)
    const [nama, setName] = useState({ value: "", msg: "" })
    const [noKTP, setNoKTP] = useState({ value: "", msg: "" })
    const [tempatLahir, setTempatLahir] = useState({ value: "", msg: "" })
    const [tanggalLahir, setTanggalLahir] = useState({ value: "", msg: "" })
    const [jenisKelamin, setJenisKelamin] = useState("L")
    const [loading, setLoading] = useState(false)
    const [showSelectDate, setShowSelectDate] = useState(false)
    const [provinsi, setProvinsi] = useState({ value: { id: 0, label: "" }, msg: "", status: false })
    const [kabupaten, setKabupaten] = useState({ value: { id: 0, label: "" }, msg: "", status: false })
    const [kecamatan, setKecamatan] = useState({ value: { id: 0, label: "" }, msg: "", status: false })
    const [kelurahan, setKelurahan] = useState({ value: { id: 0, label: "" }, msg: "", status: false })
    const [rt, setRt] = useState({ value: "", msg: "" })
    const [rw, setRw] = useState({ value: "", msg: "" })
    const [kodePos, setKodePos] = useState({ value: "", msg: "" })
    const [noHp, setNoHp] = useState({ value: "", msg: "" })
    const [email, setEmail] = useState({ value: "", msg: "" })
    const [pekerjaan, setPekerjaan] = useState({ value: "", msg: "" })
    const [fotoKtp, setFotoKtp] = useState({ value: "", msg: "" })

    const uploadImage = async (image: any) => {
        try {
            const formData = new FormData()
            formData.append("file", {
                name: image.path.split("/").slice(-1)[0],
                type: image.mime,
                uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
            })
            const postImg = await uploadFile("/upload", formData)
            setFotoKtp({
                value: postImg.data,
                msg: ""
            })

        } catch (error) {
            ToastAndroid.show("Gagal melakukan upload !", ToastAndroid.SHORT)
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
            setShowSelectImage(false)
            uploadImage(image)

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
            setShowSelectImage(false)
            uploadImage(image)

        }).catch((error: any) => {
            console.log("select image canceled !");
        });
    }

    const statusRegister = async () => {
        setLoadingCheckRegister(true)
        try {
            const jadabRegis = await getRegisterJadabRequest()
            console.log("jadabRegis => ", jadabRegis);

        } catch (error) {
            console.log("che => ", error);

        } finally {
            setLoadingCheckRegister(false)
        }
    }

    const postRegisterTahap1 = async () => {
        setLoading(true)
        try {
            await postRegisterTahap1Request({
                nama_lengkap: nama.value,
                nomor_ktp: noKTP.value,
                tempat_lahir: tempatLahir.value,
                tanggal_lahir: tanggalLahir.value,
                jenis_kelamin: jenisKelamin as JenisKelamin,
            })
            setActiveTab(1)

        } catch (error) {
            ToastAndroid.show("Gagal melakukan daftar JADAB tahap 1 !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    const postRegisterTahap2 = async () => {
        setLoading(true)
        try {
            let payload = {
                id_provinsi: provinsi.value.id,
                id_kota_kabupaten: kabupaten.value.id,
                id_kecamatan: kecamatan.value.id,
                id_desa_keluarahan: kelurahan.value.id,
                kodepos: kodePos.value,
                rt: rt.value,
                rw: rw.value
            }

            await postRegisterTahap2Request(payload)
            setActiveTab(2)

        } catch (error) {
            ToastAndroid.show(error.response?.data || "Gagal melakukan daftar JADAB tahap 2!", ToastAndroid.SHORT)
        } finally {
            setLoading(false)
        }
    }

    const postRegisterTahap3 = async () => {
        setLoading(true)
        try {
            let payload = {
                nomor_telepon: noHp.value,
                email: email.value,
                pekerjaan: pekerjaan.value,
                url_pas_foto: fotoKtp.value,
                url_foto_ktp: fotoKtp.value
            }
            console.log(payload, 'payloadpayload');

            await postRegisterTahap3Request(payload)
            setActiveTab(3)

        } catch (error) {
            ToastAndroid.show("Gagal melakukan daftar JADAB tahap 3 !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    const handleSelectedBirthday = (e: DateTimePickerEvent, data: Date | undefined) => {
        setShowSelectDate(false)
        setTanggalLahir({ value: moment(data).startOf("day").format("DD MMM YYYY"), msg: "" })
    }

    useFocusEffect(
        useCallback(() => {
            statusRegister()
        }, [])
    )

    return (
        <View className="flex-1 bg-white p-4">
            {
                loadingCheckRegister ?
                    <View className="items-center justify-center flex-1">
                        <Components.LoadMore isEndPages={false} label="Memuat pendaftaran ..." />
                    </View>
                    :
                    <>
                        {
                            activeTab !== 3 &&
                            <>
                                <View className="flex-row items-center">
                                    <View className={`flex-1 h-[5px] rounded-2xl ${activeTab === 0 ? "bg-Primary/Main" : "bg-Neutral/40"}`}></View>
                                    <View className={`flex-1 h-[5px] rounded-2xl ${activeTab === 1 ? "bg-Primary/Main" : "bg-Neutral/40"} mx-2`}></View>
                                    <View className={`flex-1 h-[5px] rounded-2xl ${activeTab === 2 ? "bg-Primary/Main" : "bg-Neutral/40"}`}></View>
                                </View>
                                <View className="my-4">
                                    <View className="flex-row items-center">
                                        <View className="flex-1">
                                            <Text className="font-satoshi text-Neutral/90 font-medium text-lg">Daftar Komunitas Jadab</Text>
                                        </View>
                                        <View>
                                            <Assets.IconQuestion width={20} height={20} />
                                        </View>
                                    </View>
                                    <View className="mt-2">
                                        <Text className="font-satoshi text-Neutral/70">
                                            Silakan lengkapi formulir untuk mendaftar di komunitas Jadab
                                        </Text>
                                    </View>
                                </View>
                            </>
                        }

                        <View className="flex-1">
                            {
                                activeTab === 0 &&
                                <View className="flex-1">
                                    <View className="flex-1">
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Nama Lengkap"
                                                    placeholder="Masukan nama lengkap"
                                                    value={nama.value}
                                                    msg={nama.msg}
                                                    onChange={(e) => {
                                                        setName({ value: e, msg: "" })
                                                    }}
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Nomor KTP"
                                                    placeholder="Masukan nama lengkap"
                                                    value={noKTP.value}
                                                    msg={noKTP.msg}
                                                    onChange={(e) => {
                                                        setNoKTP({ value: e, msg: "" })
                                                    }}
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Tempat Lahir"
                                                    placeholder="Masukan nama lengkap"
                                                    value={tempatLahir.value}
                                                    msg={tempatLahir.msg}
                                                    onChange={(e) => {
                                                        setTempatLahir({ value: e, msg: "" })
                                                    }}
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    onPres={() => {
                                                        setShowSelectDate(true)
                                                    }}
                                                    label="Tanggal Lahir"
                                                    placeholder="Pilih tanggal"
                                                    value={tanggalLahir.value}
                                                    msg={tanggalLahir.msg}
                                                    onChange={(e) => { }}
                                                    sufix={
                                                        <View>
                                                            <Assets.IconCalender width={20} height={20} />
                                                        </View>
                                                    }
                                                />
                                            </View>
                                            <View className="my-2">
                                                <View>
                                                    <Text className="font-satoshi text-black font-medium">Jenis Kelamin <Text className="text-Primary/Main font-satoshi">*</Text></Text>
                                                </View>
                                                <View className="flex-row items-center mt-3">
                                                    <TouchableOpacity onPress={() => setJenisKelamin("L")} className="flex-row items-center flex-1">
                                                        <View>
                                                            <Components.RadioButton isChecked={jenisKelamin === "L" ? true : false} />
                                                        </View>
                                                        <View className="ml-2">
                                                            <Text className="font-satoshi text-Neutral/100">Laki - Laki</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => setJenisKelamin("P")} className="flex-row items-center flex-1">
                                                        <View>
                                                            <Components.RadioButton isChecked={jenisKelamin === "P" ? true : false} />
                                                        </View>
                                                        <View className="ml-2">
                                                            <Text className="font-satoshi text-Neutral/100">Perempuan</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </ScrollView>
                                    </View>
                                    <View className="bg-white py-2">
                                        <Components.Button
                                            loading={loading}
                                            label="Lanjutkan"
                                            onPress={postRegisterTahap1}
                                        />
                                    </View>
                                </View>
                            }

                            {
                                activeTab === 1 &&
                                <View className="flex-1">
                                    <View className="flex-1">
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Provinsi"
                                                    placeholder="Pilih provinsi"
                                                    value={provinsi.value.label}
                                                    msg={provinsi.msg}
                                                    onPres={() => {
                                                        setProvinsi({
                                                            status: true,
                                                            value: { id: 0, label: "" },
                                                            msg: ""
                                                        })
                                                    }}
                                                    onChange={(e) => { }}
                                                    sufix={
                                                        <View className={`${provinsi.status ? "rotate-90" : "-rotate-90"}`}>
                                                            <Assets.IconArrowBack width={20} height={20} />
                                                        </View>
                                                    }
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Kota / Kabupaten"
                                                    placeholder="Pilih kabupaten/kota"
                                                    value={kabupaten.value.label}
                                                    msg={kabupaten.msg}
                                                    onPres={() => {
                                                        if (provinsi.value.id !== 0) {
                                                            setKabupaten({
                                                                status: true,
                                                                value: { id: 0, label: "" },
                                                                msg: ""
                                                            })
                                                        }
                                                    }}
                                                    onChange={(e) => { }}
                                                    sufix={
                                                        <View className="-rotate-90">
                                                            <Assets.IconArrowBack width={20} height={20} />
                                                        </View>
                                                    }
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Kecamatan"
                                                    placeholder="Pilih kecamatan"
                                                    value={kecamatan.value.label}
                                                    msg={kecamatan.msg}
                                                    onPres={() => {
                                                        if (provinsi.value.id !== 0 && kabupaten.value.id !== 0) {
                                                            setKecamatan({
                                                                status: true,
                                                                value: { id: 0, label: "" },
                                                                msg: ""
                                                            })
                                                        }
                                                    }}
                                                    onChange={(e) => { }}
                                                    sufix={
                                                        <View className="-rotate-90">
                                                            <Assets.IconArrowBack width={20} height={20} />
                                                        </View>
                                                    }
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Kelurahan"
                                                    placeholder="Pilih kelurahan"
                                                    value={kelurahan.value.label}
                                                    msg={kelurahan.msg}
                                                    onPres={() => {
                                                        if (provinsi.value.id !== 0 && kabupaten.value.id !== 0 && kecamatan.value.id !== 0) {
                                                            setKelurahan({
                                                                status: true,
                                                                value: { id: 0, label: "" },
                                                                msg: ""
                                                            })
                                                        }
                                                    }}
                                                    onChange={(e) => { }}
                                                    sufix={
                                                        <View className="-rotate-90">
                                                            <Assets.IconArrowBack width={20} height={20} />
                                                        </View>
                                                    }
                                                />
                                            </View>
                                            <View className="my-2 items-center flex-row">
                                                <View className="w-6/12 pr-2">
                                                    <Components.FormInput
                                                        isRequired={true}
                                                        label="RT"
                                                        inputType="number"
                                                        placeholder="Cth : 123"
                                                        value={rt.value}
                                                        msg={rt.msg}
                                                        onChange={(e) => {
                                                            setRt({ value: e, msg: "" })
                                                        }}
                                                    />
                                                </View>
                                                <View className="w-6/12 pl-2">
                                                    <Components.FormInput
                                                        isRequired={true}
                                                        label="RW"
                                                        inputType="number"
                                                        placeholder="Cth : 123"
                                                        value={rw.value}
                                                        msg={rw.msg}
                                                        onChange={(e) => {
                                                            setRw({ value: e, msg: "" })
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Kode Pos"
                                                    inputType="number"
                                                    placeholder="Masukan kode pos"
                                                    value={kodePos.value}
                                                    msg={kodePos.msg}
                                                    onChange={(e) => {
                                                        setKodePos({ value: e, msg: "" })
                                                    }}
                                                />
                                            </View>

                                        </ScrollView>
                                    </View>
                                    <View className="bg-white py-2">
                                        <Components.Button
                                            loading={loading}
                                            label="Lanjutkan"
                                            onPress={postRegisterTahap2}
                                        />
                                    </View>
                                </View>
                            }

                            {
                                activeTab === 2 &&
                                <View className="flex-1">
                                    <View className="flex-1">
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Nomor Telepon"
                                                    inputType="number"
                                                    placeholder="Masukan nomor telepon"
                                                    value={noHp.value}
                                                    msg={noHp.msg}
                                                    onChange={(e) => {
                                                        setNoHp({ value: e, msg: "" })
                                                    }}
                                                    prefix={
                                                        <View className="border-r border-r-Neutral/90 pr-2 mr-1">
                                                            <Text className="font-satoshi font-medium">+62</Text>
                                                        </View>
                                                    }
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Alamat Email"
                                                    placeholder="Masukan alamat email"
                                                    value={email.value}
                                                    msg={email.msg}
                                                    onChange={(e) => {
                                                        setEmail({ value: e, msg: "" })
                                                    }}
                                                />
                                            </View>
                                            <View className="my-2">
                                                <Components.FormInput
                                                    isRequired={true}
                                                    label="Pekerjaan"
                                                    placeholder="Masukan pekerjaan"
                                                    value={pekerjaan.value}
                                                    msg={pekerjaan.msg}
                                                    onChange={(e) => {
                                                        setPekerjaan({ value: e, msg: "" })
                                                    }}
                                                />
                                            </View>
                                            <View className="my-2">
                                                <View>
                                                    <Text className="font-satoshi text-black font-medium">Upload Foto Ktp <Text className="text-Primary/Main font-satoshi">*</Text></Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setShowSelectImage(true)
                                                    }}
                                                    className="h-[100px] mt-3 w-full rounded-md flex items-center justify-center"
                                                    style={{
                                                        borderStyle: "dashed",
                                                        borderRadius: 1,
                                                        borderColor: theme?.colors!["Neutral/40"] as string,
                                                        borderWidth: 1
                                                    }}>

                                                    {
                                                        fotoKtp.value !== "" ?
                                                            <Image source={{ uri: fotoKtp.value }} width={100} height={100} />
                                                            :
                                                            <Assets.IconPlus width={30} height={30} />
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        </ScrollView>
                                    </View>
                                    <View className="bg-white py-2">
                                        <Components.Button
                                            loading={loading}
                                            label="Lanjutkan"
                                            onPress={postRegisterTahap3}
                                        />
                                    </View>
                                </View>
                            }

                            {
                                activeTab === 3 &&
                                <View className="flex-1">
                                    <View className="flex-1 justify-center">
                                        <View className="items-center">
                                            <Assets.ImageFinishRegisterJadab width={120} height={120} />
                                        </View>
                                        <View className="my-3">
                                            <Text className="font-satoshi text-Neutral/90 text-center text-lg font-medium">Pendaftaran Komunitas Jadab Selesai!</Text>
                                        </View>
                                        <View>
                                            <Text className="font-satoshi text-Neutral/70 text-center text-sm">
                                                Pendaftaran komunitas Jadab anda sedang dalam proses verifikasi admin, Proses verifikasi memakan waktu 3 hari kerja
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="bg-white py-2">
                                        <Components.Button
                                            label="Lanjutkan"
                                            onPress={() => {
                                                navigation.navigate("ListChat")
                                            }}
                                        />
                                    </View>
                                </View>
                            }
                        </View>
                    </>
            }

            {
                showSelectDate &&
                <DateTimePicker
                    testID="dateTimePickerBirthday"
                    value={new Date()}
                    maximumDate={new Date()}
                    mode={"date"}
                    is24Hour={true}
                    onChange={handleSelectedBirthday}
                />
            }

            {
                showModalsSelectImage &&
                <Components.ModalsChoseImageFrom
                    isShow={showModalsSelectImage}
                    handleClose={() => {
                        setShowSelectImage(false)
                    }}
                    fromCamera={choseImageCamera}
                    fromFileExplorer={choseImageExplorer}
                />
            }

            {
                <Components.ModalsProvince
                    isShow={provinsi.status}
                    handleShowHideModals={() => {
                        setProvinsi({
                            ...provinsi,
                            status: !provinsi.status
                        })
                    }}
                    handleSelected={(value: number, label: string) => {
                        setProvinsi({
                            ...provinsi,
                            status: false,
                            value: {
                                id: value,
                                label: label
                            },
                        })
                    }}
                />
            }

            {
                <Components.ModalsKabupaten
                    idProvinsi={provinsi.value.id}
                    isShow={kabupaten.status}
                    handleShowHideModals={() => {
                        setKabupaten({
                            ...kabupaten,
                            status: !kabupaten.status
                        })
                    }}
                    handleSelected={(value: number, label: string) => {
                        setKabupaten({
                            ...kabupaten,
                            status: false,
                            value: {
                                id: value,
                                label: label
                            },
                        })
                    }}
                />
            }

            {
                <Components.ModalsKecamatan
                    idProvinsi={provinsi.value.id}
                    idKabupaten={kabupaten.value.id}
                    isShow={kecamatan.status}
                    handleShowHideModals={() => {
                        setKecamatan({
                            ...kecamatan,
                            status: !kecamatan.status
                        })
                    }}
                    handleSelected={(value: number, label: string) => {
                        setKecamatan({
                            ...kecamatan,
                            status: false,
                            value: {
                                id: value,
                                label: label
                            },
                        })
                    }}
                />
            }

            {
                <Components.ModalsKelurahan
                    idProvinsi={provinsi.value.id}
                    idKabupaten={kabupaten.value.id}
                    idKecamatan={kecamatan.value.id}
                    isShow={kelurahan.status}
                    handleShowHideModals={() => {
                        setKelurahan({
                            ...kelurahan,
                            status: !kelurahan.status
                        })
                    }}
                    handleSelected={(value: number, label: string) => {
                        setKelurahan({
                            ...kelurahan,
                            status: false,
                            value: {
                                id: value,
                                label: label
                            },
                        })
                    }}
                />
            }
        </View>
    )
}

export default RegisterJadab