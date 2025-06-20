// src/components/layout/Topbar.tsx
import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, Moon, Sun, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { useTheme } from '../../contexts/themeContext';
import { useNotification } from '../../contexts/notificationContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Componentes Estilizados ---

const TopbarContainer = styled.header`
  height: 75px;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  animation: ${fadeIn} 0.5s ease-out;
  transition: background-color 0.7s ease, border-bottom: 0.7s ease;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  transition: color 0.7s ease;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  position: relative;
  background-color: transparent;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.textSecondary};
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.7s ease;
  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
`;

const UnreadIndicator = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ef4444;
  border: 2px solid ${({ theme }) => theme.cardBg};
  transition: all 0.7s ease;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 380px;
  max-height: 400px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
  visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;

  &.active {
    opacity: 1;
    transform: scale(1) translateY(0);
    visibility: visible;
  }
`;

const NotificationHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  
  h4 { margin: 0; }
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  transition: all 0.7s ease;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div<{ $isRead: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  opacity: ${({ $isRead }) => ($isRead ? 0.6 : 1)};
  transition: all 0.7s ease;
  
  &:last-child { border-bottom: none; }
`;

const NoNotifications = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.7s ease;
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const AvatarImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
`;

const AvatarFallback = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  transition: all 0.7s ease;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 260px;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  padding: 0.5rem 0;
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
  visibility: hidden;
  &.active {
    opacity: 1;
    transform: scale(1) translateY(0);
    visibility: visible;
  }
`;

const DropdownHeader = styled.div`
  padding: 0.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  margin-bottom: 0.5rem;
  transition: all 0.7s ease;
`;

const DropdownUserName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  transition: all 0.7s ease;
`;

const DropdownUserEmail = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.7s ease;
`;

const DropdownLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.7s ease;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
  svg {
    width: 18px;
    height: 18px;
  }
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  font: inherit;
  width: 100%;
  
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.7s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// --- Componente ---

const getPageTitle = (path: string): string => {
  const name = path.split('/').pop()?.replace('-', ' ') || '';
  const pathMap: { [key: string]: string } = {
    '/app': 'Painel de Controle', 'perfil': 'Meu Perfil', 'conta/configuracoes': 'Configurações',
    'historico': 'Histórico', 'simulador': 'Simulador', 'residencia': 'Minha Residência', 'dicas': 'Dicas de Economia'
  };
  return pathMap[name] || 'EcoEnergia';
};

export const Topbar = () => {
  const { user, signOut } = useAuth();
  const { themeName, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotification(); 

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setNotificationMenuOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setNotificationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    signOut();
  };

  return (
    <TopbarContainer>
      <PageTitle>{pageTitle}</PageTitle>

      <ActionsWrapper>
        <IconButton onClick={toggleTheme} title={`Mudar para modo ${themeName === 'light' ? 'escuro' : 'claro'}`}>
          {themeName === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </IconButton>
        
        <MenuWrapper ref={notificationMenuRef}>
          <IconButton title="Notificações" onClick={() => setNotificationMenuOpen(p => !p)}>
            {unreadCount > 0 && <UnreadIndicator />}
            <Bell size={20} />
          </IconButton>

          <NotificationDropdown className={isNotificationMenuOpen ? 'active' : ''}>
            <NotificationHeader>
              <h4>Notificações</h4>
              {unreadCount > 0 && (
                <MarkAllReadButton onClick={markAllAsRead}>
                  Marcar todas como lidas
                </MarkAllReadButton>
              )}
            </NotificationHeader>
            <NotificationList>
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <NotificationItem key={n.id} $isRead={n.is_read}>
                    <p>{n.message}</p>
                    <small>{new Date(n.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>
                  </NotificationItem>
                ))
              ) : (
                <NoNotifications>Nenhuma notificação por aqui.</NoNotifications>
              )}
            </NotificationList>
          </NotificationDropdown>
        </MenuWrapper>
        
        <MenuWrapper ref={userMenuRef}>
          <div onClick={() => setIsUserMenuOpen(p => !p)}>
            {user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt="Avatar do usuário" />
            ) : (
              <AvatarFallback><User size={22} /></AvatarFallback>
            )}
          </div>
          
          <DropdownMenu className={isUserMenuOpen ? 'active' : ''}>
            <DropdownHeader>
              <DropdownUserName>{user?.name || 'Usuário'}</DropdownUserName>
              <DropdownUserEmail>{user?.email || ''}</DropdownUserEmail>
            </DropdownHeader>
            <DropdownLink to="/app/perfil" onClick={() => setIsUserMenuOpen(false)}>
              <User />
              <span>Perfil</span>
            </DropdownLink>
            <DropdownLink to="/app/conta/configuracoes" onClick={() => setIsUserMenuOpen(false)}>
              <Settings />
              <span>Configurações</span>
            </DropdownLink>
            <DropdownButton onClick={handleSignOut}>
              <LogOut />
              <span>Sair</span>
            </DropdownButton>
          </DropdownMenu>
        </MenuWrapper>
      </ActionsWrapper>
    </TopbarContainer>
  );
};