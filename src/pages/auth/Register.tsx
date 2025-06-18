// src/pages/auth/Register.tsx

import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import { PublicHeader } from '../../components/common/PublicHeader';

// --- STYLES ---

const RegisterWrapper = styled.div`
  display: flex;
    flex-direction: column;
    min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 120px 2rem 2rem 2rem; 
  background-color: ${({ theme }) => theme.body};
`;

const RegisterCard = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 2.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
  margin-bottom: 1.5rem;
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
  background-color: ${({ theme }) => theme.bodySecondary};
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
  margin-top: 1.5rem;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const LoginLink = styled.p`
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


// --- COMPONENT ---

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.post('/auth/register', { name, email, password });
      alert('Cadastro realizado com sucesso! Você já pode fazer o login.');
      navigate('/login');
    } catch (error: any) {
      console.error('Falha no cadastro:', error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao tentar cadastrar.';
      alert(errorMessage);
    }
  };

  return (
    <>
      <PublicHeader />
      <RegisterWrapper>
        <RegisterCard onSubmit={handleSubmit}>
          <Title>Crie sua conta EcoEnergia</Title>
          <InputGroup>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <SubmitButton type="submit">Cadastrar</SubmitButton>
          <LoginLink>
            Já tem uma conta? <Link to="/login">Faça o login</Link>
          </LoginLink>
        </RegisterCard>
      </RegisterWrapper>
    </>
  );
};

export default Register;