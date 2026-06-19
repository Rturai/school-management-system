import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Enrollment from "./pages/Enrollments";
import Login from "./pages/Login"; 

function App() {
  // 🔐 CHANGED: LocalStorage ki jagah sessionStorage lagaya taaki tab band karte hi log out ho jaye
  const isAuthenticated = sessionStorage.getItem('authToken') === 'schoolsync-dummy-token-2026';

  return (
    <Router>
      <Routes>
        {/* 🔑 1. LOGIN ROUTE: Agar session active nahi hai toh login screen dikhao */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />

        {/* 🛡️ 2. PROTECTED ROUTES: Har ek route ab sessionStorage se secure hai */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/students" 
          element={isAuthenticated ? <Students /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teachers" 
          element={isAuthenticated ? <Teachers /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/classes" 
          element={isAuthenticated ? <Classes /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/Enrollment" 
          element={isAuthenticated ? <Enrollment /> : <Navigate to="/login" />} 
        />

        {/* 🔄 3. FALLBACK CATCH */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;