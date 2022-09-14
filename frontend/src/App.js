import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import Navbar from './components/Header';
import { UserDetailsProvider } from './context/UserContext'
function App() {
  return (
    <Router>
        <UserDetailsProvider>
            <Navbar />
            <main>
                <Routes>
                    <Route path='/home' element={<HomePage/>} exact />
                    <Route path='/login' element={<LoginPage/>} exact />
                    <Route path='/forgot' element={<ForgotPasswordPage/>} exact />
                </Routes>
            </main>
            <Footer />
        </UserDetailsProvider>
    </Router>
  );
}

export default App;
