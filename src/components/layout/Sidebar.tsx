// src/components/layout/Sidebar.tsx
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Bot, Wrench, Lightbulb } from 'lucide-react';
import logo from '../../assets/logo.png';

const SidebarContainer = styled.aside`
  width: 260px;
  background-color: ${({ theme }) => theme.cardBg};
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const LogoContainer = styled(Link)`
  display: flex;
  justify-content: center; /* Centraliza a logo */
  align-items: center;
  margin-bottom: 2.5rem;
  text-decoration: none;

  img {
    height: 100px; 
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;

  color: ${({ theme, $isActive }) => $isActive ? theme.primary : theme.textSecondary};
  background-color: ${({ theme, $isActive }) => $isActive ? `${theme.primary}20` : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.text};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/app', icon: <LayoutDashboard />, label: 'Painel de Controle' },
    { to: '/app/historico', icon: <BarChart3 />, label: 'Histórico' },
    { to: '/app/simulador', icon: <Bot />, label: 'Simulador' },
    { to: '/app/residencia', icon: <Wrench />, label: 'Residência' },
    { to: '/app/dicas', icon: <Lightbulb />, label: 'Dicas' },
  ];

  return (
    <SidebarContainer>
      <LogoContainer to="/app">
        <img src={logo} alt="Logo" />
      </LogoContainer>
      <Nav>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} $isActive={location.pathname === item.to}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </Nav>
    </SidebarContainer>
  );
};