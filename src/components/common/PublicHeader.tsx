import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useTheme } from '../../contexts/themeContext';

const HeaderContainer = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  background-color: ${({ theme, $isScrolled }) =>
    $isScrolled ? theme.cardBg : 'transparent'};
  box-shadow: ${({ theme, $isScrolled }) =>
    $isScrolled ? `0 2px 10px ${theme.shadowColor}` : 'none'};
`;

const Logo = styled.img`
  height: 60px;
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 820px) {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.cardBg};
    flex-direction: column;
    padding: ${({ $isOpen }) => ($isOpen ? '2rem 0' : '0')};
    gap: 1.5rem;
    max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
    overflow: hidden;
    transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out;
  }
`;

const NavLink = styled.a`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.text};
    transition: color 0.2s ease;
    &::after {
      width: 100%;
    }
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled(RouterLink)<{ primary?: boolean }>`
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  
  background-color: ${({ theme, primary }) =>
    primary ? theme.primary : 'transparent'};
  color: ${({ theme, primary }) => (primary ? '#fff' : theme.text)};
  border: 1px solid ${({ theme, primary }) => (primary ? theme.primary : theme.borderColor)};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  @media (max-width: 820px) {
    display: block;
    z-index: 1001;
  }
`;

const IconButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  padding: 0.5rem;
  border-radius: 50%;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    color: ${({ theme }) => theme.primary};
  }
`;

export const PublicHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { themeName, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <HeaderContainer $isScrolled={isScrolled}>
      <RouterLink to="/">
        <Logo src={logo} alt="EcoEnergia Logo" />
      </RouterLink>
      
      <Nav $isOpen={isMenuOpen}>
        <NavLink onClick={() => scrollToSection('features')}>Funcionalidades</NavLink>
        <NavLink onClick={() => scrollToSection('how-it-works')}>Como Funciona</NavLink>
        <NavLink onClick={() => scrollToSection('cta')}>Contato</NavLink>
      </Nav>

      <ActionsWrapper>
        <IconButton onClick={toggleTheme} title={`Mudar para modo ${themeName === 'light' ? 'escuro' : 'claro'}`}>
            {themeName === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </IconButton>
        <Button to="/login">Entrar</Button>
        <Button to="/cadastro" primary>Cadastre-se Grátis</Button>
        <MobileMenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </MobileMenuToggle>
      </ActionsWrapper>
    </HeaderContainer>
  );
};