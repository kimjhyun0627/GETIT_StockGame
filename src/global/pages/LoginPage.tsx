// LoginPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import GoogleLoginButton from "../components/GoogleLogin"
import useUserInfo from "../../store/states/userInfo";


const LoginPage = () => {
    const navigate = useNavigate();
    const { username, email } = useUserInfo();
    const setUserInfo = useUserInfo(state => state.updateUserInfo)
    const [userCookie, setUserCookie] = useCookies(["userinfo"]);

    useEffect(() => {
        const user = userCookie.userinfo;

        if (!user) {
            console.log("no usercookie");
            const expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 1000);
            setUserCookie("userinfo",
                JSON.stringify({
                    username: "",
                    email: "",
                }),
                { path: "/", expires: expires });

            setUserInfo("", "");
        }
        else {
            if (user.email === "getit0official@gmail.com") {
                navigate('/commander');
            }
            else if (user.email.endsWith("@gmail.com")) {
                navigate('/user');
            }
            else if (user.email.endsWith("@knu.ac.kr")) {
                navigate('/user');
            }
        }
    }, [navigate, userCookie])

    return (
        <div>
            <GoogleLoginButton />
        </div>
    )
}

export default LoginPage