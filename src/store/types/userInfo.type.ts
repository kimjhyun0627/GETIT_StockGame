// userInfo.type.ts

export default interface userInfoType {
    username: string,
    email: string,
    updateUserInfo: (name: string, email: string) => void
}