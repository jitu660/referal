import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReferralPage from "./pages/ReferralPage";
import Dashboard from "./pages/Dashboard";
import { GlobalStyles } from "./styles/GlobalStyles";
import { ThemeProvider } from "./styles/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<ReferralPage userId={"mockUser123"} />} />
          <Route path="/referral" element={<ReferralPage userId={"mockUser123"} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
