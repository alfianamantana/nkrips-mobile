import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Pages from '../pages';
import Assets from '../assets';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { Fragment, useEffect, useState } from 'react';
import Components from '../components';
import { storeShowCustomRight, storeShowMenuChat, storeShowSideBar, storeUserChatDetail, storeUserGroupDetail } from '../store';
import { PostingType } from "@pn/watch-is/model"
import messaging from '@react-native-firebase/messaging';
import PengajuanSayaScreen from "../pages/home/settings/register-jadab/pengajuan-saya";
import RegisterBusiness from '../pages/home/register-business'
import DetailBusiness from '../pages/home/settings/register-jadab/detail'
import PayJadab from '../pages/home/settings/register-jadab/pay'
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    PostProfile: { username: string, isMyProfile?: boolean };
    DetailChat: { public_hash: string, isComunity?: boolean };
};

const RouteApps = () => {
    const [keywordsSearchChat, setKeywordsSearchChat] = useState("")
    const { setShowMenuChat } = storeShowMenuChat()
    const { dataUser } = storeUserChatDetail()
    const { dataGruop } = storeUserGroupDetail()
    const { setShowCustomRight } = storeShowCustomRight()

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    useEffect(() => {
        requestUserPermission()
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="ListChat"
                screenOptions={{
                    animation: "none"
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={Pages.Login}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={Pages.Register}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="InputOTP"
                    component={Pages.InputOTP}
                    options={({ navigation }) => ({
                        title: "Kode OTP",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="CreateUsername"
                    component={Pages.CreateUsername}
                    options={({ navigation }) => ({
                        title: "Buat Akun Baru",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="InputDataRegister"
                    component={Pages.InputDataRegister}
                    options={({ navigation }) => ({
                        title: "Data Diri",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="ListChat"
                    component={TabNavigation}
                    options={({ navigation }) => ({
                        headerShown: false
                    })}
                />
                <Stack.Screen
                    name="DetailChat"
                    component={Pages.DetailChat}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <View className="flex-row items-center">
                                <TouchableOpacity className="pr-3" onPress={() => navigation.navigate("ListChat")}>
                                    <Assets.IconArrowBack width={25} height={25} />
                                </TouchableOpacity>

                                {
                                    Object.keys(dataGruop).length > 0 ?
                                        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.navigate("Profile", { isGroup: true, public_id: dataGruop.public_identifier })}>
                                            <View>
                                                {
                                                    Object.keys(dataGruop).length > 0 &&
                                                        dataGruop.logo !== null ?
                                                        <Image source={{ uri: dataGruop.logo }} width={30} height={30} className="rounded-full" />
                                                        :
                                                        <Assets.ImageGroupEmptyProfile width={30} height={30} />
                                                }
                                            </View>
                                            <View className="px-3">
                                                <Text className="font-satoshi font-medium text-gray-600">{dataGruop.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            className="flex-row items-center"
                                            onPress={() => {
                                                navigation.navigate("Profile",
                                                    {
                                                        username: Object.keys(dataUser).length > 0 && dataUser.username,
                                                        public_id: Object.keys(dataUser).length > 0 && dataUser.public_hash,
                                                    })
                                            }
                                            }>
                                            <View>
                                                {
                                                    Object.keys(dataUser).length > 0 &&
                                                        dataUser.profile_picture_url !== null ?
                                                        <Image source={{ uri: dataUser.profile_picture_url }} width={30} height={30} className="rounded-full" />
                                                        :
                                                        <Assets.ImageEmptyProfile width={30} height={30} />
                                                }
                                            </View>
                                            <View className="px-3">
                                                <Text className="font-satoshi font-medium text-gray-600">{dataUser.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                }
                            </View>
                        ),
                        headerRight: () => (
                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={() => navigation.navigate("VoiceCall")}>
                                    <Assets.IconCallBlack width={20} height={20} />
                                </TouchableOpacity>

                                <TouchableOpacity className="pl-2" onPress={() => setShowMenuChat()}>
                                    <Assets.IconMore width={20} height={20} />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="ListContact"
                    component={Pages.ListContact}
                    options={({ navigation }) => ({
                        title: "Pesan Baru",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="ChoseMemberGroup"
                    component={Pages.ChoseMember}
                    options={({ navigation }) => ({
                        title: "Pilih Anggota Grup",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="CreateGroup"
                    component={Pages.CreateGroup as any}
                    options={({ navigation }) => ({
                        title: "Grub Baru",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="CreateTopik"
                    component={Pages.Topik}
                    options={({ navigation }) => ({
                        title: "Buat Topik",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="Profile"
                    component={Pages.Profile}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <View className="flex-row items-center">
                                <TouchableOpacity className="pl-2">
                                    <Assets.IconMore width={20} height={20} />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="SearchChat"
                    component={Pages.SearchChat}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <View className="flex-row items-center flex-1">
                                <View className="w-1/12">
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Assets.IconArrowBack width={25} height={25} />
                                    </TouchableOpacity>
                                </View>
                                <View className="w-10/12">
                                    <Components.FormInput
                                        customHeight={40}
                                        isBackground={true}
                                        placeholder="Cari ..."
                                        value={keywordsSearchChat}
                                        onChange={setKeywordsSearchChat}
                                        sufix={
                                            <View>
                                                <Assets.IconSearch width={15} height={15} />
                                            </View>
                                        }
                                    />
                                </View>
                            </View>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="TermsAndCondition"
                    component={Pages.TermsAndCondition}
                    options={({ navigation }) => ({
                        title: "Syarat dan ketentuan",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="VoiceCall"
                    component={Pages.VoiceCall}
                    options={({ navigation }) => ({
                        headerShown: false
                    })}
                />
                <Stack.Screen
                    name="PostProfile"
                    component={Pages.PostProfile}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="Setting"
                    component={Pages.Setting}
                    options={({ navigation }) => ({
                        title: "Pengaturan",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="PreviewMedia"
                    component={Pages.PreviewMedia}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <View className="flex-row items-center">
                                <TouchableOpacity className="pl-2" onPress={() => setShowCustomRight()}>
                                    <Assets.IconMore width={20} height={20} />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="EditProfile"
                    component={Pages.EditProfile}
                    options={({ navigation }) => ({
                        title: "Edit Profile",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="MyGroup"
                    component={Pages.MyGroup}
                    options={({ navigation }) => ({
                        title: "Grup Saya",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="MyFriends"
                    component={Pages.MyFriends}
                    options={({ navigation }) => ({
                        title: "Teman Saya",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <View className="flex-row items-center">
                                <TouchableOpacity className="pl-2" onPress={() => navigation.navigate("AddFriends")}>
                                    <Assets.IconAddFriend width={25} height={25} />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="BlockHistory"
                    component={Pages.BlockHistory}
                    options={({ navigation }) => ({
                        title: "Riwayat Blokir",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="ConfirmFriends"
                    component={Pages.ConfirmFriends}
                    options={({ navigation }) => ({
                        title: "Konfirmasi Pertemanan (10)",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <View className="flex-row items-center">
                                <TouchableOpacity className="pl-2" onPress={() => navigation.navigate("AddFriends")}>
                                    <Assets.IconAddFriend width={25} height={25} />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="ChangeNumber"
                    component={Pages.ChangeNumber}
                    options={({ navigation }) => ({
                        title: "Ganti Nomor Telepon",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="MediaChat"
                    component={Pages.MediaChat}
                    options={({ navigation }) => ({
                        title: "Media",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="HelpCenter"
                    component={Pages.HelpCenter}
                    options={({ navigation }) => ({
                        title: "Pusat Bantuan",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="AddFriends"
                    component={Pages.AddFriends}
                    options={({ navigation }) => ({
                        title: "Tambahkan teman",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="Notification"
                    component={Pages.Notification}
                    options={({ navigation }) => ({
                        title: "Notifikasi",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="Search"
                    component={Pages.Search}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <View className="flex-row items-center flex-1">
                                <View className="w-1/12">
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Assets.IconArrowBack width={25} height={25} />
                                    </TouchableOpacity>
                                </View>
                                <View className="w-10/12">
                                    <Components.FormInput
                                        customHeight={40}
                                        isBackground={true}
                                        placeholder="Cari ..."
                                        value={keywordsSearchChat}
                                        onChange={setKeywordsSearchChat}
                                        sufix={
                                            <View>
                                                <Assets.IconSearch width={15} height={15} />
                                            </View>
                                        }
                                    />
                                </View>
                            </View>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="MyBadge"
                    component={Pages.MyBadge}
                    options={({ navigation }) => ({
                        title: "Lencana Saya",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="RegisterJadab"
                    component={Pages.RegisterJadab}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />

                <Stack.Screen
                    name="PengajuanSaya"
                    component={PengajuanSayaScreen}
                    options={({ navigation }) => ({
                        title: "Pengajuan Saya",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />

                <Stack.Screen
                    name="RegisterBussiness"
                    component={RegisterBusiness}
                    options={({ navigation }) => ({
                        title: "",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />

                <Stack.Screen
                    name="DetailBussiness"
                    component={DetailBusiness}
                    options={({ navigation }) => ({
                        title: "Bagi Hasil",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />

                <Stack.Screen
                    name="PayJadab"
                    component={PayJadab}
                    options={({ navigation }) => ({
                        title: "Bayar Bagi Hasil",
                        headerTitleStyle: {
                            fontFamily: "Satoshi",
                            fontWeight: "600",
                            fontSize: 14
                        },
                        headerLeft: () => (
                            <TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
                                <Assets.IconArrowBack width={25} height={25} />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false
                    })}
                />

                {/* DetailBusiness */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const TabNavigation = () => {
    const { setShowSideBar } = storeShowSideBar()

    return (
        <Tab.Navigator
            initialRouteName="Chat"
        >
            <Tab.Screen
                name="Chat"
                component={Pages.ListChat}
                options={({ navigation }) => ({
                    tabBarActiveTintColor: "#ED0226",
                    tabBarInactiveTintColor: "#C2C2C2",
                    tabBarLabel: "Pesan",
                    title: "Pesan",
                    headerTitleStyle: {
                        fontFamily: "Satoshi",
                        fontSize: 17,
                        fontWeight: "500"
                    },
                    headerShadowVisible: false,
                    tabBarLabelStyle: {
                        fontFamily: "Satoshi",
                        fontWeight: "500"
                    },
                    tabBarStyle: {
                        minHeight: 65,
                        paddingBottom: 10,
                        paddingTop: 10
                    },
                    tabBarIcon: ({ focused }) => (
                        <Fragment>
                            {
                                focused ?
                                    <Assets.IconChatActive width={25} height={25} />
                                    :
                                    <Assets.IconChat width={25} height={25} />
                            }
                        </Fragment>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="pl-4 justify-center items-center" onPress={() => setShowSideBar()}>
                            <Assets.IconMenu width={20} height={20} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View className="items-center flex-row">
                            {/* <TouchableOpacity onPress={() => navigation.navigate("Notification")} className="pr-4 justify-center items-center">
                                <Assets.IconNotif width={20} height={20} />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => navigation.navigate("Search")} className="pr-4 justify-center items-center">
                                <Assets.IconSearch width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            />
            <Tab.Screen
                name="Feed"
                component={Pages.Feed}
                initialParams={{ type: "" }}
                options={({ navigation }) => ({
                    tabBarActiveTintColor: "#ED0226",
                    tabBarInactiveTintColor: "#C2C2C2",
                    tabBarLabel: "Kabar",
                    title: "Kabar",
                    headerTitleStyle: {
                        fontFamily: "Satoshi",
                        fontSize: 17,
                        fontWeight: "500"
                    },
                    tabBarLabelStyle: {
                        fontFamily: "Satoshi",
                        fontWeight: "500"
                    },
                    tabBarStyle: {
                        minHeight: 65,
                        paddingBottom: 10,
                        paddingTop: 10
                    },
                    tabBarIcon: ({ focused }) => (
                        <Fragment>
                            {
                                focused ?
                                    <Assets.IconFeedActive width={25} height={25} />
                                    :
                                    <Assets.IconFeed width={25} height={25} />
                            }
                        </Fragment>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="pl-4 justify-center items-center" onPress={() => setShowSideBar()}>
                            <Assets.IconMenu width={20} height={20} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View className="items-center flex-row">
                            {/* <TouchableOpacity onPress={() => navigation.navigate("Notification")} className="pr-4 justify-center items-center">
                                <Assets.IconNotif width={20} height={20} />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => navigation.navigate("Search")} className="pr-4 justify-center items-center">
                                <Assets.IconSearch width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            />
            <Tab.Screen
                name="Video"
                component={Pages.Feed}
                initialParams={{ type: PostingType.VIDEO }}
                options={({ navigation }) => ({
                    tabBarActiveTintColor: "#ED0226",
                    tabBarInactiveTintColor: "#C2C2C2",
                    tabBarLabel: "Video",
                    title: "Video",
                    headerTitleStyle: {
                        fontFamily: "Satoshi",
                        fontSize: 17,
                        fontWeight: "500"
                    },
                    tabBarLabelStyle: {
                        fontFamily: "Satoshi",
                        fontWeight: "500"
                    },
                    tabBarStyle: {
                        minHeight: 65,
                        paddingBottom: 10,
                        paddingTop: 10
                    },
                    tabBarIcon: ({ focused }) => (
                        <Fragment>
                            {
                                focused ?
                                    <Assets.IconVideoActive width={25} height={25} />
                                    :
                                    <Assets.IconVideo width={25} height={25} />
                            }
                        </Fragment>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="pl-4 justify-center items-center" onPress={() => setShowSideBar()}>
                            <Assets.IconMenu width={20} height={20} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View className="items-center flex-row">
                            {/* <TouchableOpacity onPress={() => navigation.navigate("Notification")} className="pr-4 justify-center items-center">
                                <Assets.IconNotif width={20} height={20} />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => navigation.navigate("Search")} className="pr-4 justify-center items-center">
                                <Assets.IconSearch width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            />
            <Tab.Screen
                name="Shop"
                component={Pages.Feed}
                initialParams={{ type: PostingType.SELL_PRODUCT }}
                options={({ navigation }) => ({
                    tabBarActiveTintColor: "#ED0226",
                    tabBarInactiveTintColor: "#C2C2C2",
                    tabBarLabel: "Jual Beli",
                    title: "Jual Beli",
                    headerTitleStyle: {
                        fontFamily: "Satoshi",
                        fontSize: 17,
                        fontWeight: "500"
                    },
                    tabBarLabelStyle: {
                        fontFamily: "Satoshi",
                        fontWeight: "500"
                    },
                    tabBarStyle: {
                        minHeight: 65,
                        paddingBottom: 10,
                        paddingTop: 10
                    },
                    tabBarIcon: ({ focused }) => (
                        <Fragment>
                            {
                                focused ?
                                    <Assets.IconShopActive width={25} height={25} />
                                    :
                                    <Assets.IconShop width={25} height={25} />
                            }
                        </Fragment>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="pl-4 justify-center items-center" onPress={() => setShowSideBar()}>
                            <Assets.IconMenu width={20} height={20} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View className="items-center flex-row">
                            {/* <TouchableOpacity onPress={() => navigation.navigate("Notification")} className="pr-4 justify-center items-center">
                                <Assets.IconNotif width={20} height={20} />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => navigation.navigate("Search")} className="pr-4 justify-center items-center">
                                <Assets.IconSearch width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            />
            <Tab.Screen
                name="Call"
                component={Pages.ListCall}
                options={({ navigation }) => ({
                    tabBarActiveTintColor: "#ED0226",
                    tabBarInactiveTintColor: "#C2C2C2",
                    tabBarLabel: "Panggilan",
                    title: "Panggilan",
                    headerTitleStyle: {
                        fontFamily: "Satoshi",
                        fontSize: 17,
                        fontWeight: "500"
                    },
                    tabBarLabelStyle: {
                        fontFamily: "Satoshi",
                        fontWeight: "500"
                    },
                    tabBarStyle: {
                        minHeight: 65,
                        paddingBottom: 10,
                        paddingTop: 10
                    },
                    tabBarIcon: ({ focused }) => (
                        <Fragment>
                            {
                                focused ?
                                    <Assets.IconCallActive width={25} height={25} />
                                    :
                                    <Assets.IconCall width={25} height={25} />
                            }
                        </Fragment>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="pl-4 justify-center items-center" onPress={() => setShowSideBar()}>
                            <Assets.IconMenu width={20} height={20} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View className="items-center flex-row">
                            <TouchableOpacity onPress={() => navigation.navigate("Notification")} className="pr-4 justify-center items-center">
                                <Assets.IconNotif width={20} height={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Search")} className="pr-4 justify-center items-center">
                                <Assets.IconSearch width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            />
        </Tab.Navigator>
    )
}

export default RouteApps