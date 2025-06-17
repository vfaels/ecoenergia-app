// src/pages/dashboard/TipsPage.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Lightbulb } from 'lucide-react';
import { fetchDashboardData } from '../../services/api';

// --- Tipagem para as dicas ---
interface Tip {
  id: number;
  title: string;
  content: string;
}

// --- Componentes Estilizados (respeitando o tema) ---

const TipsWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }
  p {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
    box-shadow: 0 4px 20px ${({ theme }) => theme.primary}20;
  }
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const TipTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const TipContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.textSecondary};
`;

// --- Componente Principal da Página ---

const TipsPage = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. LÓGICA DE BUSCA CORRIGIDA
    const loadData = async () => {
      try {
        // Chama a função que busca TUDO
        const apiData = await fetchDashboardData(); 
        // Pega apenas a parte de 'tips' dos dados retornados
        setTips(apiData.tips.map((tip: any) => ({
          id: tip.id,
          title: tip.title,
          content: tip.content ?? tip.description ?? '', // Ajuste conforme o nome correto do campo de texto
        }))); 
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Carregando dicas...</div>;
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
              <Lightbulb size={22} color="currentColor" />
              <TipTitle>{tip.title}</TipTitle>
            </TipHeader>
            <TipContent>{tip.description}</TipContent>
          </TipCard>
        ))}
      </TipsGrid>
    </TipsWrapper>
  );
};

export default TipsPage;