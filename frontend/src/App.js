import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useMemo } from "react";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Navbar from "./components/Header";
import {UserProvider} from "./context/UserContext";

function App() {
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({user, setUser}), [user, setUser])
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/login" element={<LoginPage />} exact />
            <Route
              path="/reset_password"
              element={<ForgotPasswordPage />}
              exact
            />
          </Routes>
        </main>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
