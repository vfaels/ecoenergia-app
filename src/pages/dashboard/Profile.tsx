// src/pages/dashboard/Profile.tsx
import styled from 'styled-components';
import { User, Mail, Edit, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const ProfileWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
  }
`;

const EditProfileButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const AvatarImage = styled.img`
  width: 340px;
  height: 340px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.primary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const AvatarFallback = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.cardBg};
  border: 4px solid ${({ theme }) => theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 700px;
  margin: 0 auto; // Centraliza o card
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.primary};
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
`;

const InfoDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textSecondary};
`;

// --- Componente da Página ---

const Profile = () => {

  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState>Carregando perfil...</LoadingState>;
  }

  if (!user) {
    return <LoadingState>Não foi possível carregar os dados do perfil.</LoadingState>;
  }

  return (
    <ProfileWrapper>
      <Header>
        <h1>Meu Perfil</h1>
        <EditProfileButton to="/app/conta/configuracoes">
          <Edit size={18} />
          Editar Perfil
        </EditProfileButton>
      </Header>

      <AvatarContainer>
        {user.avatar_url ? (
          <AvatarImage src={user.avatar_url} alt="Foto de Perfil" />
        ) : (
          <AvatarFallback>
            <UserCircle2 size={150} />
          </AvatarFallback>
        )}
      </AvatarContainer>

      <ProfileCard>
        <InfoRow>
          <IconWrapper>
            <User size={24} />
          </IconWrapper>
          <InfoDetails>
            <InfoLabel>Nome Completo</InfoLabel>
            <InfoValue>{user.name}</InfoValue>
          </InfoDetails>
        </InfoRow>

        <InfoRow>
          <IconWrapper>
            <Mail size={24} />
          </IconWrapper>
          <InfoDetails>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoDetails>
        </InfoRow>
      </ProfileCard>
    </ProfileWrapper>
  );
};

export default Profile;