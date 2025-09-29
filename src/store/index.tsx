import { Community, User } from '@pn/watch-is/model';
import { SaveOptions, RemoveOptions } from 'typeorm';
import { create } from 'zustand';

interface interfaceShowMenuChat {
    showMenuChat : boolean,
    setShowMenuChat : () => void
}

export const storeShowMenuChat = create<interfaceShowMenuChat>(set => ({
    showMenuChat : false,
    setShowMenuChat : () => set(state => ({ showMenuChat: !state.showMenuChat }))
}))

interface interfaceShowChatHold {
    showMenuChatHold : boolean,
    setShowMenuChatHold : () => void
}

export const storeShowMenuChatHold = create<interfaceShowChatHold>(set => ({
    showMenuChatHold : false,
    setShowMenuChatHold : () => set(state => ({ showMenuChatHold: !state.showMenuChatHold }))
}))


interface interfaceShowSideBar {
    showSideBar : boolean,
    setShowSideBar : () => void
}

export const storeShowSideBar = create<interfaceShowSideBar>(set => ({
    showSideBar : false,
    setShowSideBar : () => set(state => ({ showSideBar: !state.showSideBar }))
}))

interface interfaceShowModalsComment {
    showModalsComment : {
        hash : string,
        status : boolean
    },
    setShowModalsComment : (hash:string, status:boolean) => void
}

export const storeShowModalsComment = create<interfaceShowModalsComment>(set => ({
    showModalsComment : { hash:"", status: false },
    setShowModalsComment: (hash: string, status: boolean) => set(() => ({ showModalsComment: { hash, status }}))
}))


interface interfaceUserChatDetail {
    dataUser : User | any,
    setDataUser : (data:User) => void
}
export const storeUserChatDetail = create<interfaceUserChatDetail>(set => ({
    dataUser : {},
    setDataUser: (data:User) => set(() => ({ dataUser: data}))
}))

interface interfaceUserGroup {
    dataGruop : Community | any,
    setDataGruop : (data:Community) => void
}
export const storeUserGroupDetail = create<interfaceUserGroup>(set => ({
    dataGruop : {},
    setDataGruop: (data:Community) => set(() => ({ dataGruop: data}))
}))


interface interfaceShowCustomModalRight {
    showCustomRight : boolean,
    setShowCustomRight : () => void
}
export const storeShowCustomRight = create<interfaceShowCustomModalRight>(set => ({
    showCustomRight : false,
    setShowCustomRight : () => set(state => ({ showCustomRight: !state.showCustomRight }))
}))