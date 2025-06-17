// src/pages/dashboard/Profile.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User, Mail, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// --- Tipagem para o Usuário ---
interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string; // Opcional, caso queira adicionar no futuro
}

// --- Componentes Estilizados ---
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

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 700px;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // O db.json tem um objeto "user"
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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