// UserPage.tsx

import { useNavigate } from "react-router-dom";
import ChartPage from "../components/ChartPage"
import StockHandlerPage from "../components/StockHandlerPage"
import useUserInfo from "../../store/stores/useUserInfo";
import { useEffect } from "react";

const UserPage = () => {

    const navigate = useNavigate();
    const { username, email } = useUserInfo();

    useEffect(() => {
        if (username === "GET IT" || email === "getit0official@gmail.com") {
            navigate('/commander')
        }

    }, [username, email])

    return (
        <div>
            <p>userpage</p>
            <ChartPage />
            <StockHandlerPage />
        </div>
    )
}

export default UserPage