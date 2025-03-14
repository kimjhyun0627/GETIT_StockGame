// userLogin.tsx

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useUserInfo from "../../store/states/userInfo";

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const [, setUserCookie] = useCookies(["userinfo"]);
    const setUserInfo = useUserInfo(state => state.updateUserInfo)

    function decodeJwtResponse(token: string) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const handleCredentialResponse = (res: CredentialResponse) => {
        const responsePayload = decodeJwtResponse(res.credential!);

        const expires = new Date();
        expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000);
        setUserCookie("userinfo",
            JSON.stringify({
                username: responsePayload.name,
                email: responsePayload.email
            }),
            { path: "/", expires: expires });

        setUserInfo(responsePayload.name, responsePayload.email);


        // console.log("ID: " + responsePayload.sub);
        // console.log('Full Name: ' + responsePayload.name);
        // console.log('Given Name: ' + responsePayload.given_name);
        // console.log('Family Name: ' + responsePayload.family_name);
        // console.log("Image URL: " + responsePayload.picture);
        // console.log("Email: " + responsePayload.email);

        navigate('/');

    }

    return (
        <GoogleLogin
            onSuccess={(credentialResponse) => {
                handleCredentialResponse(credentialResponse);
            }}
            onError={() => { console.log('google login error') }}
            auto_select
            useOneTap
            logo_alignment="center"
        />
    )
}

export default GoogleLoginButton