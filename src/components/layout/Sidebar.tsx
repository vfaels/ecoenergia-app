import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Bot, Wrench, Lightbulb, ChevronLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

interface NavLinkProps {
  $isActive: boolean;
  $isCollapsed: boolean;
}


const SidebarContainer = styled.aside<{ $isCollapsed: boolean }>`
  width: ${({ $isCollapsed }) => ($isCollapsed ? '50px' : '160px')};
  background-color: ${({ theme }) => theme.cardBg};
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.5s ease-in-out, background-color 0.7s ease, border-right 0.7s ease;
  position: relative;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  height: 90px; 
  text-decoration: none;
`;

const Logo = styled.img<{ $isCollapsed: boolean }>`
  width: auto; 
  padding-top: 0.5rem;
  transition: height 0.3s ease-in-out;

  height: ${({ $isCollapsed }) => ($isCollapsed ? '40px' : '80px')};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LinkLabel = styled.span<{ $isCollapsed: boolean }>`
  white-space: nowrap;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity 0.2s 0.1s ease-in-out;
`;

const NavLink = styled(Link)<NavLinkProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.8rem 1.25rem;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  color: ${({ theme, $isActive }) => ($isActive ? theme.text : theme.textSecondary)};
  background-color: transparent;
  transition: color 0.7s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: ${({ $isActive }) => ($isActive ? '60%' : '0')};
    width: 4px;
    background-color: ${({ theme }) => theme.primary};
    border-radius: 0 4px 4px 0;
    transition: height 0.2s ease, background-color 0.7s ease;
  }

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.7s ease, color 0.7s ease;
  }

  svg {
    min-width: 24px;
    width: 24px;
    height: 24px;
    color: ${({ theme, $isActive }) => ($isActive ? theme.primary : theme.textSecondary)};
    transition: color 0.7s ease;
  }

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      justify-content: center;
      ${LinkLabel} {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
    `}
`;

const CollapseButton = styled.button<{ $isCollapsed: boolean }>`
  position: absolute;
  top: 80px;
  right: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 11;
  transition: transform 0.3s ease, background-color 0.7s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }

  svg {
    transition: transform 0.3s ease-in-out;
    transform: ${({ $isCollapsed }) => ($isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

// --- Componente ---

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/app', icon: <LayoutDashboard />, label: 'Dashboard' },
    { to: '/app/historico', icon: <BarChart3 />, label: 'Histórico' },
    { to: '/app/simulador', icon: <Bot />, label: 'Simulador' },
    { to: '/app/residencia', icon: <Wrench />, label: 'Residência' },
    { to: '/app/dicas', icon: <Lightbulb />, label: 'Dicas' },
  ];

  return (
    <SidebarContainer $isCollapsed={isCollapsed}>
      <CollapseButton 
        $isCollapsed={isCollapsed} 
        onClick={() => setIsCollapsed(p => !p)}
        title={isCollapsed ? "Expandir" : "Encolher"}
      >
        <ChevronLeft size={18} />
      </CollapseButton>

      <LogoContainer to="/app">
        <Logo
          src={logo}
          alt="EcoEnergia Logo"
          $isCollapsed={isCollapsed}
        />
      </LogoContainer>

      <Nav>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            $isActive={location.pathname === item.to}
            $isCollapsed={isCollapsed}
            title={isCollapsed ? item.label : ''}
          >
            {item.icon}
            <LinkLabel $isCollapsed={isCollapsed}>{item.label}</LinkLabel>
          </NavLink>
        ))}
      </Nav>
    </SidebarContainer>
  );
};