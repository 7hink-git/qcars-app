import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import CarDetailsPage from './pages/CarDetails';
import BookingPage from './pages/Booking';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin'; 
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

const App = () => {
  return (
    <LanguageProvider>
      <DataProvider>
        <AuthProvider>
          <HashRouter>
            <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-indigo-200 selection:text-indigo-900">
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/car/:id" element={<CarDetailsPage />} />
                  <Route path="/book/:id" element={<BookingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </HashRouter>
        </AuthProvider>
      </DataProvider>
    </LanguageProvider>
  );
};

export default App;