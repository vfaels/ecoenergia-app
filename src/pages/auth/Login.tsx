// src/pages/auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/authContext';
import { PublicHeader } from '../../components/common/PublicHeader';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bodySecondary};
  font-family: 'Poppins', sans-serif;
  padding-top: 80px;
  transition: background-color 0.3s ease;
`;

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 450px;
  text-align: center;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33; 
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const SignupLink = styled.p`
  margin-top: 2rem;
  color: ${({ theme }) => theme.textSecondary};

  a {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;


const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Tentativa de login com:', { email, password });
    login({ name: 'Fael Melo', email: email });
  };

  return (
    <>
      <PublicHeader />
      <LoginWrapper>
        <LoginCard>
          <Title>Bem-vindo de volta!</Title>
          <Subtitle>Acesse sua conta para continuar.</Subtitle>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Senha</Label>
              <Input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </InputGroup>
            <SubmitButton type="submit">Entrar</SubmitButton>
          </Form>
          <SignupLink>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </SignupLink>
        </LoginCard>
      </LoginWrapper>
    </>
  );
};

export default Login;