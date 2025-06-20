// src/pages/dashboard/AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import api from '../../services/api';
import { User as UserIcon, Upload } from 'lucide-react';

// --- Componentes Estilizados (Adicionados os que faltavam) ---

const SettingsWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
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

// Estilos do Avatar (que estavam faltando)
const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2.5rem;
  margin-bottom: 2rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.primary};
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.body};
  border: 3px solid ${({ theme }) => theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const UploadLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.cardBg};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const HiddenInput = styled.input`
  display: none;
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

// --- Componente da Página Corrigido ---
const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Popula o formulário com os dados do usuário do contexto
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      setAvatarPreview(user.avatar_url || null);
    }
  }, [user]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;

    const uploadFormData = new FormData();
    uploadFormData.append('avatar', avatarFile);

    try {
      const response = await api.put('/users/me/avatar', uploadFormData);
      
      const updatedUser = { ...user, avatar_url: response.data.avatar_url };
      updateUser(updatedUser); // Atualiza o contexto
      setAvatarFile(null); // Limpa o arquivo para o botão sumir
      alert('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      alert('Falha ao atualizar o avatar.');
      setAvatarPreview(user.avatar_url || null); // Reverte o preview
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      // ATENÇÃO: Verifique se você tem uma rota PUT /api/users/me no seu backend
      const response = await api.put('/users/me', formData);
      updateUser(response.data); // Atualiza o contexto com os novos dados
      alert('Informações atualizadas com sucesso!');
      navigate('/app/perfil');
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
      alert('Ocorreu um erro. Tente novamente.');
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A lógica de alteração de senha deve ser implementada no backend
    alert('Funcionalidade de alterar senha ainda não implementada.');
  };

  if (authLoading) return <p>Carregando...</p>;

  const handleAvatarRemove = async () => {
    if (!user || !window.confirm("Tem certeza que deseja remover sua foto de perfil?")) {
      return;
    }

    try {
      const response = await api.delete('/users/me/avatar');
      
      updateUser(response.data);
      
      alert('Foto de perfil removida com sucesso!');
    } catch (error) {
      console.error("Erro ao remover a foto:", error);
      alert("Falha ao remover a foto de perfil. Tente novamente.");
    }
  };

  if (authLoading) return <p>Carregando...</p>;

  return (
    <SettingsWrapper>
      <Header>
        <h1>Configurações da Conta</h1>
      </Header>

      <AvatarSection>
        <SectionTitle>Foto de Perfil</SectionTitle>
        <AvatarWrapper>
          {avatarPreview ? (
            <AvatarImage src={avatarPreview} alt="Avatar Preview" />
          ) : (
            <AvatarFallback>
              <UserIcon size={48} />
            </AvatarFallback>
          )}
          <UploadLabel htmlFor="avatar-upload">
            <Upload size={16} />
          </UploadLabel>
          <HiddenInput
            id="avatar-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleAvatarChange} />
        </AvatarWrapper>

        {avatarFile && (
          <Button className="primary" onClick={handleAvatarUpload}>Salvar Nova Foto</Button>
        )}

        {user?.avatar_url && !avatarFile && (
          <Button
            type="button"
            className="secondary"
            onClick={handleAvatarRemove}
            style={{ borderColor: '#ef4444', color: '#ef4444' }} 
          >
            Remover Foto
          </Button>
        )}
      </AvatarSection>

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