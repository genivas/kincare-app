import { useState, useContext } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Medications from './pages/Medications'
import Tasks from './pages/Tasks'
import Schedule from './pages/Schedule'
import History from './pages/History'
import Settings from './pages/Settings'
import Support from './pages/Support'
import Landing from './pages/Landing'
import BottomNav from './components/BottomNav'
import Alarm from './components/Alarm'
import { GlobalProvider, GlobalContext } from './context/GlobalContext'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
import DownloadPage from './pages/Download'

import Onboarding from './pages/Onboarding'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(GlobalContext);
  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (!currentUser.familyId) return <Navigate to="/onboarding" />;
  return children;
};

import { Capacitor } from '@capacitor/core';

function AppRoutes() {
  const { currentUser } = useContext(GlobalContext);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isOnboardingPage = location.pathname === '/onboarding';
  const isWelcomePage = location.pathname === '/welcome';
  const isDownloadPage = location.pathname === '/download';

  const hideNav = isLandingPage || isLoginPage || isOnboardingPage || isWelcomePage || isDownloadPage;
  const isMarketingPage = isLandingPage || isDownloadPage;
  const isNative = Capacitor.isNativePlatform();

  // If the user has seen the welcome flow before, skip it.
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';

  return (
    <div className={isMarketingPage ? "" : "app-container"} style={{background: isLandingPage ? 'var(--bg-color)' : '', minHeight: '100vh', position: 'relative'}}>
      <Routes>
        <Route path="/" element={isNative ? (hasSeenWelcome ? <Navigate to="/app" replace /> : <Navigate to="/welcome" replace />) : <Landing />} />
        <Route path="/welcome" element={currentUser ? <Navigate to="/app" /> : <Welcome />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={currentUser ? (currentUser.familyId ? <Navigate to="/app" /> : <Onboarding />) : <Navigate to="/login" />} />
        
        {/* Protected Routes */}
        <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/app/medications" element={<ProtectedRoute><Medications /></ProtectedRoute>} />
        <Route path="/app/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/app/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="/app/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/app/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {!hideNav && <BottomNav />}
      <Alarm />
    </div>
  )
}

function App() {
  return (
    <GlobalProvider>
      <AppRoutes />
    </GlobalProvider>
  )
}

export default App
