import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DetailPage from "./pages/DetailPage";
import Navbar from "./components/Header";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} exact />
              <Route path="/login" element={<LoginPage />} exact />
              <Route path="/forgot" element={<ForgotPasswordPage />} exact />
              <Route path="/product:id" element={<DetailPage />} exact />
            </Routes>
          </main>
          <Footer />
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
