import AES from 'react-native-aes-crypto'
import { SECRET_KEY } from '@env';

export const encryptAES = async (text:string, iv:string) => {
    try {
        const ciphertext = await AES.encrypt(text, SECRET_KEY, iv, "aes-256-cbc");
        return ciphertext;

    } catch (error) {
        console.error('Error encrypting:', error);
        throw error;
    }
};

export const decryptAES = async (ciphertext:string, iv:string) => {
    try {
        const plaintext = await AES.decrypt(ciphertext, SECRET_KEY, iv, "aes-256-cbc");
        return plaintext;

    } catch (error) {
        console.error('Error decrypting:', error);
        throw error;
    }
};
