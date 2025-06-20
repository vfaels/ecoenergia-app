// src/router/AppRouter.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DashboardHome from '../pages/dashboard/DashboardHome';
import History from '../pages/dashboard/History';
import Simulator from '../pages/dashboard/Simulator';
import { ResidenceSettings } from '../pages/dashboard/ResidenceSettings';
import TipsPage from '../pages/dashboard/TipsPage';
import Profile from '../pages/dashboard/Profile';
import AccountSettings from '../pages/dashboard/AccountSettings';
import { MainLayout } from '../components/layout/MainLayout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardHome />} /> 
          <Route path="historico" element={<History />} />
          <Route path="simulador" element={<Simulator />} />
          <Route path="residencia" element={<ResidenceSettings />} />
          <Route path="dicas" element={<TipsPage />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="conta/configuracoes" element={<AccountSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};