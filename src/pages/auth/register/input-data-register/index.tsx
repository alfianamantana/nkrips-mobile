import { ScrollView, Text, ToastAndroid, View } from "react-native"
import Assets from "../../../../assets"
import Components from "../../../../components"
import { FC, useState } from "react"
import { dataDiriRequest } from "../../../../services/auth/register"
import DateTimePicker from "@react-native-community/datetimepicker"
import { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import moment from "moment-timezone"
import Joi from "joi"

interface InputDataRegisterInterface {
    navigation : any
}

const schema = Joi.object({
    name : Joi.string()
    .empty()
    .required()
    .messages({
        'any.required': 'Nama lengkap diperlukan.',
        'string.empty' : 'Nama lengkap tidak boleh kosong.'
    }),
    tanggalLahir : Joi.string()
    .empty()
    .required()
    .messages({
        'any.required': 'Tanggal lahir diperlukan.',
        'string.empty' : 'Tanggal lahir tidak boleh kosong.'
    }),
    email : Joi.string()
    .email({ tlds: false })
    .empty()
    .required()
    .messages({
        'string.email' : 'Email tidak valid !',
        'any.required': 'Email diperlukan.',
        'string.empty' : 'Email tidak boleh kosong.'
    }),
})

const InputDataRegister:FC<InputDataRegisterInterface> = ({ navigation }) => {
    const [name, setName]                 = useState("")
    const [nameMsg, setNameMsg]           = useState("")
    const [tanggalLahir, setTanggalLahir] = useState("")
    const [tanggalLahirMsg, setTanggalLahirMsg]  = useState("")
    const [email, setemail]               = useState("")
    const [emailMsg, setEmailMsg]         = useState("")
    const [loading, setLoading]           = useState(false)
    const [showSelectDate, setShowSelectDate] = useState(false)

    const proccessRegister = async () => {
        setLoading(true)
        try {
            const { error } = schema.validate({
                name        : name,
                email       : email,
                tanggalLahir: tanggalLahir,
            })
    
            if(error === undefined) {
                await dataDiriRequest(name, email, tanggalLahir)
                navigation.navigate("TermsAndCondition", {
                    isRegister : true
                })
    
            } else {
                if(error?.details && error?.details.length > 0) {
                    if(error?.details[0].context?.key === "fullName") {
                        setNameMsg(error?.details[0].message)
                    }

                    if(error?.details[0].context?.key === "email") {
                        setEmailMsg(error?.details[0].message)
                    }

                    if(error?.details[0].context?.key === "tanggalLahir") {
                        setTanggalLahirMsg(error?.details[0].message)
                    }
                }
            }
            
        } catch (error) {
            ToastAndroid.show("Gagal menyimpan data diri !", ToastAndroid.SHORT)

        } finally {
            setLoading(false)
        }
    }

    const handleSelectedBirthday = (e:DateTimePickerEvent, data:Date|undefined) => {
        setShowSelectDate(false)
        setTanggalLahir( moment(data).startOf("day").format("DD MMM YYYY") )
    }

    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <View className="my-2">
                            <Components.FormInput
                                isRequired={true}
                                label="Nama Lengkap"
                                placeholder="Masukan nama lengkap"
                                value={name}
                                onChange={setName}
                                msg={nameMsg}
                            />
                        </View>
                        <View className="my-2">
                            <Components.FormInput
                                onPres={() => {
                                    setShowSelectDate(true)
                                }}
                                msg={tanggalLahirMsg}
                                isRequired={true}
                                label="Tanggal Lahir"
                                placeholder="Masukan tanggal lahir"
                                value={tanggalLahir}
                                onChange={setTanggalLahir}
                                sufix={
                                    <View>
                                        <Assets.IconCalender/>
                                    </View>
                                }
                            />
                        </View>
                        <View className="my-2">
                            <Components.FormInput
                                msg={emailMsg}
                                isRequired={true}
                                label="Email"
                                placeholder="Masukan email"
                                onChange={setemail}
                                value={email}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View className="py-2 bg-white">
                <Components.Button
                    label="Daftar"
                    isDisabled={false}
                    onPress={proccessRegister}
                    loading={loading}
                />
            </View>

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
        </View>
    )
}

export default InputDataRegister