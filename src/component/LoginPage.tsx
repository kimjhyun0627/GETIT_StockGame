import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const LoginPage: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [cookies, setCookie] = useCookies(["user"]);
    const navigate = useNavigate();

    const handleLogin = () => {
        // 이름을 쿠키에 저장
        setCookie("user", name, { path: "/" });

        // 쿠키에 정보가 저장되면 리렌더링 후 적절한 페이지로 이동
        if (name === "ggetitofficial") {
            navigate("/commander");
        } else {
            navigate("/user");
        }
    };

    return (
        <div>
            <h1>로그인</h1>
            <input
                type="text"
                placeholder="사용자 이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
};

export default LoginPage;
