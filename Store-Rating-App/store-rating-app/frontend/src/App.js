import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './components/Admin/Dashboard';
import OwnerDashboard from './components/StoreOwner/Dashboard';
import UserDashboard from './components/NormalUser/Dashboard';

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

const PrivateRoute = ({ children, roles }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/owner" element={<PrivateRoute roles={['Store Owner','System Administrator']}><OwnerDashboard /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute roles={['Normal User','Store Owner','System Administrator']}><UserDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;