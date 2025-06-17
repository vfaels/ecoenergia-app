// src/pages/dashboard/AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

// --- Componentes Estilizados ---
const SettingsWrapper = styled.div`
  max-width: 800px;
  animation: fadeIn 0.5s ease-in-out;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
  }
`;

const Form = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2.5rem;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    &:hover {
      background-color: ${({ theme }) => theme.primaryHover};
    }
  }

  &.secondary {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.borderColor};
    color: ${({ theme }) => theme.textSecondary};
    &:hover {
      background-color: ${({ theme }) => theme.cardBg};
      color: ${({ theme }) => theme.text};
    }
  }
`;

// --- Componente da Página ---
const AccountSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user');
        setFormData({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simula a atualização na API
      await api.patch('/user', formData);
      alert('Informações atualizadas com sucesso!');
      navigate('/app/perfil');
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
      alert('Ocorreu um erro. Tente novamente.');
    }
  };
  
  // A lógica de alteração de senha é mais complexa no back-end.
  // Aqui, apenas simulamos a validação e o envio.
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert('A nova senha e a confirmação não correspondem.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }
    alert('Funcionalidade de alterar senha a ser implementada.');
    // Ex: await api.post('/user/change-password', passwordData);
    console.log('Dados para alterar senha:', passwordData);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <SettingsWrapper>
      <Header>
        <h1>Configurações da Conta</h1>
      </Header>
      
      <Form onSubmit={handleInfoSubmit}>
        <Section>
          <SectionTitle>Informações Pessoais</SectionTitle>
          <FormGroup>
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" name="name" type="text" value={formData.name} onChange={handleInfoChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInfoChange} />
          </FormGroup>
        </Section>
        <ButtonGroup>
            <Button type="button" className="secondary" onClick={() => navigate('/app/perfil')}>Cancelar</Button>
            <Button type="submit" className="primary">Salvar Alterações</Button>
        </ButtonGroup>
      </Form>
      
      <Form onSubmit={handlePasswordSubmit} style={{ marginTop: '2rem' }}>
        <Section>
            <SectionTitle>Alterar Senha</SectionTitle>
            <FormGroup>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} />
            </FormGroup>
        </Section>
        <ButtonGroup>
            <Button type="submit" className="primary">Alterar Senha</Button>
        </ButtonGroup>
      </Form>
    </SettingsWrapper>
  );
};

export default AccountSettings;