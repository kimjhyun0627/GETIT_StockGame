// userInfo.ts

import { create } from "zustand";
import userInfoType from "../types/userInfo.type";

const useUserInfo = create<userInfoType>((set, get) => ({
    username: "",
    email: "",
    updateUserInfo: (username, email) => set(() => ({ username: username, email: email }))
}));

export default useUserInfo;