import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/authContext';
import { PublicHeader } from '../../components/common/PublicHeader'; // 1. Importar o Header

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
  padding-top: 100px;
`;

const LoginCard = styled.form`
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
  font-size: 1.1rem;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 1.5rem;
  width: 100%;
  & + & {
    margin-top: 1rem;
  }
  &:last-child {
    margin-bottom: 0;
  }
  &:focus-within {
    label {
      color: ${({ theme }) => theme.primary};
    }
  }
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
  margin-top: 1rem;
  width: 100%;
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
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    await signIn({ email, password });
  };

  return (
    <>
      <PublicHeader /> {/* 2. Adicionar o Header de volta */}
      <LoginWrapper>
        <LoginCard onSubmit={handleSubmit}>
          <Title>Bem-vindo de volta!</Title>
          <Subtitle>Acesse sua conta para continuar.</Subtitle>
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
          <SignupLink>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </SignupLink>
        </LoginCard>
      </LoginWrapper>
    </>
  );
};

export default Login;