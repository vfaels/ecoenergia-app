import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';


const RegisterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
`;

const RegisterForm = styled.form`
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    text-align: center;
    margin-bottom: 2rem;
  }

  p {
    text-align: center;
    margin-top: 1.5rem;
    color: ${({ theme }) => theme.textSecondary};

    a {
      color: ${({ theme }) => theme.primary};
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.body};
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}30;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

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
    <RegisterWrapper>
      <RegisterForm onSubmit={handleSubmit}>
        <h2>Criar Conta</h2>
        <Input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Cadastrar</Button>
        <p>
          Já tem uma conta? <Link to="/login">Faça o login</Link>
        </p>
      </RegisterForm>
    </RegisterWrapper>
  );
};

export default Register;