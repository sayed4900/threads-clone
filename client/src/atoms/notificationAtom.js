import {atom} from 'recoil' ; 

const notificationAtom = atom({
  key:"notificationAtom",
  default:[]
})

export const messageNotificationAtom = atom({
  key:"messageNotificationAtom",
  default:[]
})


export default notificationAtom;