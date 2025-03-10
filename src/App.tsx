import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import UserPage from "./component/UserPage";
import CommanderPage from "./component/CommanderPage";
import LoginPage from "./component/LoginPage";

const App: React.FC = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const [user, setUser] = useState<string | null>(null);

  // 쿠키에 사용자 정보가 있으면 해당 정보를 가져온다
  useEffect(() => {
    if (cookies.user) {
      setUser(cookies.user);
    }
  }, [cookies]);

  // 쿠키가 없다면 로그인 페이지로 이동
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // 사용자 정보가 있으면 특수 이름에 따라 다른 페이지로 리다이렉트
  return (
    <Router>
      <Routes>
        <Route path="/user" element={user !== "ggetitofficial" ? <UserPage /> : <Navigate to="/commander" />} />
        <Route path="/commander" element={user === "ggetitofficial" ? <CommanderPage /> : <Navigate to="/user" />} />
        <Route path="*" element={<Navigate to={user !== "ggetitofficial" ? "/user" : "/commander"} />} />
      </Routes>
    </Router>
  );
};

export default App;
