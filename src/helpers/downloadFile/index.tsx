import { PermissionsAndroid, Platform, ToastAndroid } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

const actualDownload = (name="", url="") => {
    const { dirs }  = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb  = {
        fileCache: true,
        addAndroidDownloads : {
            useDownloadManager  : true,
            notification        : true,
            mediaScannable      : true,
            title               : name,
            path                : `${dirs.DownloadDir}/${name}`,
        },
        useDownloadManager  : true,
        notification        : true,
        mediaScannable      : true,
        title               : name,
        path                : `${dirToSave}/${name}`,
    };

    const configOptions = Platform.select({
        ios: configfb,
        android: configfb,
    });
    
    RNFetchBlob.config(configOptions || {}).fetch('GET', url, {}).then(res => {
        if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
        }

        if (Platform.OS === 'android') {
            ToastAndroid.show("File berhasil di unduh !", ToastAndroid.SHORT)   
        }
        
    }).catch(e => {
        ToastAndroid.show("File gagal di unduh !", ToastAndroid.SHORT)
    });
};

export const downloadWithCheckPermissioin = async (name="", url="") => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        // const grantedManage = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            actualDownload(name, url);

        } else {
            ToastAndroid.show("Izinkan akses penyimpanan !", ToastAndroid.SHORT)
        }

    } catch (err) {
        console.log("display error",err)    
    }
};