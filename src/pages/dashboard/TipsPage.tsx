// src/pages/dashboard/TipsPage.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Lightbulb } from 'lucide-react';
import api from '../../services/api';

// --- Tipagem para as dicas ---
interface Tip {
  id: number;
  title: string;
  content: string;
}

// --- Componentes Estilizados ---
const TipsWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const TipCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 25px ${({ theme }) => theme.primary}20;
  }
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.primary};
`;

const TipTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const TipContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.textSecondary};
  flex-grow: 1;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textSecondary};
`;

// --- Componente Principal da Página ---
const TipsPage = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTips = async () => {
      setLoading(true);
      try {
        // A API em db.json tem a rota como "tips"
        const response = await api.get('/tips');
        setTips(response.data);
      } catch (error) {
        console.error("Erro ao buscar as dicas de economia:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  if (loading) {
    return <LoadingState>Carregando dicas...</LoadingState>;
  }

  return (
    <TipsWrapper>
      <Header>
        <h1>Dicas de Economia</h1>
        <p>Pequenas mudanças de hábito que fazem uma grande diferença na sua conta de luz.</p>
      </Header>
      <TipsGrid>
        {tips.map(tip => (
          <TipCard key={tip.id}>
            <TipHeader>
              <IconWrapper>
                <Lightbulb size={24} />
              </IconWrapper>
              <TipTitle>{tip.title}</TipTitle>
            </TipHeader>
            <TipContent>{tip.content}</TipContent>
          </TipCard>
        ))}
      </TipsGrid>
    </TipsWrapper>
  );
};

export default TipsPage;