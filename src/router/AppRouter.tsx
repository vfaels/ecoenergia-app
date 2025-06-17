// src/router/AppRouter.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

// Importe TODOS os seus componentes de página
import { LandingPage } from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import DashboardHome from '../pages/dashboard/DashboardHome';
import History from '../pages/dashboard/History';
import Simulator from '../pages/dashboard/Simulator';
import { ResidenceSettings } from '../pages/dashboard/ResidenceSettings';
import Profile from '../pages/dashboard/Profile';
import AccountSettings from '../pages/dashboard/AccountSettings';
import { MainLayout } from '../components/layout/MainLayout';


// 1. Componente para proteger as rotas
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  // Se estiver logado, permite o acesso à rota filha (via Outlet)
  // Se não, redireciona para a página de login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. Componente para as rotas públicas (evita que um usuário logado as veja)
const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  // Se estiver logado, redireciona para o dashboard
  // Se não, permite o acesso à rota pública (login, landing page)
  return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
};


// 3. O Roteador Principal
export const AppRouter = () => {
  return (
    <Routes>
      {/* Rotas Públicas: Acessíveis apenas se o usuário NÃO estiver logado */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Rotas Privadas: Acessíveis apenas se o usuário ESTIVER logado */}
      <Route path="/app" element={<ProtectedRoute />}>
        {/* Todas as rotas aqui dentro usarão o MainLayout como "casca" */}
        <Route element={<MainLayout />}>
          <Route index element={<DashboardHome />} /> {/* Rota inicial do app */}
          <Route path="historico" element={<History />} />
          <Route path="simulador" element={<Simulator />} />
          <Route path="residencia" element={<ResidenceSettings />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="conta/configuracoes" element={<AccountSettings />} />
        </Route>
      </Route>

      {/* Rota de fallback: se nenhuma rota combinar, redireciona para a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};