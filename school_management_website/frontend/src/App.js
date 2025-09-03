import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import PrincipleDashboard from './pages/principle/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherOnboarding from './pages/teacher/Onboarding'; // Import the onboarding page
import { jwtDecode } from "jwt-decode"; // You must have this in your project (npm install jwt-decode)


// Enhanced ProtectedRoute: checks both token and optionally role
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  if (role) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== role) return <Navigate to="/" replace />;
    } catch {
      return <Navigate to="/" replace />;
    }
  }
  return children;
};


function App() {
  return (
    <Router>
      <Routes>
        {/* Login/Signup page with design */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Principal Dashboard */}
        <Route
          path="/principal"
          element={
            <ProtectedRoute role="principal">
              <PrincipleDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Dashboard */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Onboarding */}
        <Route
          path="/teacher/onboarding"
          element={
            <ProtectedRoute role="teacher">
              <TeacherOnboarding />
            </ProtectedRoute>
          }
        />

        {/* Fallback: redirect all other routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
