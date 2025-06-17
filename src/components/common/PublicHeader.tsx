// src/components/common/PublicHeader.tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/themeContext';
import logo from '../../assets/logo.png';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 5%;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 100px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const LogoLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 100%;

  img {
    height: 80px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  color: ${({ theme }) => theme.textSecondary};

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.text};
  }
`;

const SecondaryButton = styled(Link)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary};
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid ${({ theme }) => theme.borderColor};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.bodySecondary};
  }
`;

const PrimaryButton = styled(Link)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid ${({ theme }) => theme.primary};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

export const PublicHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <HeaderContainer>
      <LogoLink to="/">
        <img src={logo} alt="EcoEnergia Logo" />
      </LogoLink>
      <NavActions>
        <ThemeToggleButton onClick={toggleTheme} title="Alterar tema">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </ThemeToggleButton>
        <SecondaryButton to="/login">Login</SecondaryButton>
        <PrimaryButton to="/cadastro">Cadastre-se</PrimaryButton>
      </NavActions>
    </HeaderContainer>
  );
};