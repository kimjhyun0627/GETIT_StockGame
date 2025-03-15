// App.tsx

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./global/pages/LoginPage";
import UserPage from "./user/pages/UserPage";
import CommanderPage from "./commander/pages/CommanderPage";

const App: React.FC = () => {
  const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID!;

  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientID}>
        <meta
          httpEquiv="Cross-Origin-Opener-Policy"
          content="same-origin-allow-popups"
        />
        <Routes>
          <Route path="/user" element={<UserPage />} />
          <Route path="/commander" element={<CommanderPage />} />
          <Route path="/*" element={<LoginPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
};

export default App;
