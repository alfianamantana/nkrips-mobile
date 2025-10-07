import { PermissionsAndroid, Platform, ToastAndroid } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

const actualDownload = (name = "", url = "") => {
    const { dirs } = RNFetchBlob.fs;
    const androidPath = `${dirs.DownloadDir}/${name}`;
    const iosPath = `${dirs.DocumentDir}/${name}`;

    if (Platform.OS === 'android') {
        RNFetchBlob.config({
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                title: name,
                path: androidPath,
                description: 'Downloading file',
            },
        })
            .fetch('GET', url)
            .then(res => {
                ToastAndroid.show('File berhasil di unduh!', ToastAndroid.SHORT);
            })
            .catch(err => {
                console.log('Download error:', err);
                ToastAndroid.show('File gagal di unduh!', ToastAndroid.SHORT);
            });
    } else {
        // iOS: save to Documents and preview
        RNFetchBlob.config({ path: iosPath, fileCache: true })
            .fetch('GET', url)
            .then(res => {
                try {
                    // previewDocument only available on RNFetchBlob.ios
                    // @ts-ignore
                    if (RNFetchBlob.ios && RNFetchBlob.ios.previewDocument) {
                        // @ts-ignore
                        RNFetchBlob.ios.previewDocument(res.path());
                    }
                } catch (e) {
                    // ignore
                }
                ToastAndroid.show('File berhasil di unduh!', ToastAndroid.SHORT);
            })
            .catch(err => {
                console.log('Download error:', err);
                ToastAndroid.show('File gagal di unduh!', ToastAndroid.SHORT);
            });
    }
};

export const downloadWithCheckPermissioin = async (name = "", url = "") => {
    try {
        let granted = PermissionsAndroid.RESULTS.DENIED;
        // For Android 11+ (API 30+) use DownloadManager via rn-fetch-blob which does
        // not require MANAGE_EXTERNAL_STORAGE. For older versions request WRITE.
        if (parseInt(Platform.Version as string, 10) >= 30) {
            // Directly perform download using DownloadManager; no runtime permission needed in most cases
            actualDownload(name, url);
            return;
        } else {
            // For older Android versions request WRITE_EXTERNAL_STORAGE at runtime
            granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        }

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            actualDownload(name, url);
        } else {
            ToastAndroid.show("Storage permission is required to download files!", ToastAndroid.SHORT);
        }
    } catch (err) {
        console.log("Error requesting permission:", err);
        ToastAndroid.show("Failed to request permission!", ToastAndroid.SHORT);
    }
};