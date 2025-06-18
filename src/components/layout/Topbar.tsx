// src/components/layout/Topbar.tsx
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { User, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { useTheme } from '../../contexts/themeContext';

const TopbarContainer = styled.header`
  height: 70px;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2rem;
  position: relative;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 65px;
  right: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 220px;
  z-index: 1000;
  overflow: hidden;
  padding: 0.5rem 0;
  opacity: 0;
  transform: translateY(-10px);
  visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;

  &.active {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.text};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.text};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  margin: 0.5rem 0;
`;

export const Topbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <TopbarContainer>
      <div ref={dropdownRef}>
        <UserMenuButton onClick={() => setDropdownOpen(!isDropdownOpen)}>
          <UserName>{user?.name || 'Usuário'}</UserName>
          <Avatar src="https://avatars.githubusercontent.com/u/89363396?v=4&size=64" alt="Avatar do usuário" />
        </UserMenuButton>

        <DropdownMenu className={isDropdownOpen ? 'active' : ''}>
          <DropdownItem to="/app/perfil" onClick={() => setDropdownOpen(false)}>
            <User />
            <span>Perfil</span>
          </DropdownItem>
          <DropdownItem to="/app/conta/configuracoes" onClick={() => setDropdownOpen(false)}>
            <Settings />
            <span>Configurações da Conta</span>
          </DropdownItem>
          <Separator />
          <DropdownButton onClick={toggleTheme}>
            {theme === 'light' ? <Moon /> : <Sun />}
            <span>Modo {theme === 'light' ? 'Escuro' : 'Claro'}</span>
          </DropdownButton>
          <DropdownButton onClick={() => {
            signOut();
            setDropdownOpen(false);
          }}>
            <LogOut />
            <span>Sair</span>
          </DropdownButton>
        </DropdownMenu>
      </div>
    </TopbarContainer>
  );
};