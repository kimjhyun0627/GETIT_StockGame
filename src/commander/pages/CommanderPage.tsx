// CommanderPage.tsx

import DataHandlerPage from "../components/DataHandlerPage"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import useUserInfo from "../../store/stores/useUserInfo";

const CommanderPage = () => {

    const navigate = useNavigate();
    const { username, email } = useUserInfo();

    useEffect(() => {
        if (username !== "GET IT" || email !== "getit0official@gmail.com") {
            navigate('/login')
        }

    }, [username, email])

    return (
        <div>
            <h2>운영진 페이지입니다</h2>
            <DataHandlerPage />
        </div>
    )
}

export default CommanderPage