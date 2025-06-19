import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import api from '../../services/api';
import styled, { keyframes } from "styled-components";
import { Zap, DollarSign, Target, Home, Lightbulb, AlertCircle, Settings, ArrowRight } from "lucide-react";

interface DashboardData {
  consumption: { current_month_kwh: number };
  residence: { kwh_cost: number; monthly_goal_kwh: number; residents: number; rooms: number };
  tip: { title: string; content: string };
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const Grid = styled.div`
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
  
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div<{ delay?: number }>`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${({ delay = 0 }) => delay}s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${({ theme }) => theme.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  
  span {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-left: 0.5rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  overflow: hidden;
  margin-top: auto; 
`;

const ProgressFill = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  transition: width 0.5s ease-in-out;
  box-shadow: ${({ theme }) => `0 2px 4px ${theme.primary}40`};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  span {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
  }
  strong {
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const StyledLink = styled(Link)`
  margin-top: auto; 
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  align-self: flex-end;
  &:hover { text-decoration: underline; }
`;

const Alert = styled.div<{ isGood: boolean }>`
  grid-column: 1 / -1;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background-color: ${({ isGood, theme }) => isGood ? `${theme.primary}20` : '#fdecea'};
  color: ${({ isGood, theme }) => isGood ? theme.primary : '#b71c1c'};
  border: 1px solid ${({ isGood, theme }) => isGood ? theme.primary : '#f5c6cb'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
`;

const ActionButton = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    transform: translateX(5px);
  }

  & + & {
    margin-top: 1rem;
  }
`;

// --- Componente Principal ---
const DashboardHome = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consumptionRes, residenceRes, tipsRes] = await Promise.all([
          api.get('/consumption/summary'),
          api.get('/residence/me'),
          api.get('/tips')
        ]);
        setData({
          consumption: consumptionRes.data,
          residence: residenceRes.data,
          tip: tipsRes.data[Math.floor(Math.random() * tipsRes.data.length)]
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <PageWrapper><p>Carregando dashboard...</p></PageWrapper>;
  if (!data) return <PageWrapper><p>Não foi possível carregar os dados.</p></PageWrapper>;

  const { consumption, residence, tip } = data;
  const estimatedCost = consumption.current_month_kwh * residence.kwh_cost;
  const goalProgress = residence.monthly_goal_kwh > 0
    ? (consumption.current_month_kwh / residence.monthly_goal_kwh) * 100
    : 0;
  const isWithinGoal = consumption.current_month_kwh <= residence.monthly_goal_kwh;

  return (
    <PageWrapper>
      <Title>Olá, {user?.name}!</Title>
      

      <Grid>
        <Card delay={0.1}>
          <CardHeader><Zap size={18} /> Consumo do Mês</CardHeader>
          <StatValue>{consumption.current_month_kwh.toFixed(1)}<span>kWh</span></StatValue>
        </Card>

        <Card delay={0.2}>
          <CardHeader><DollarSign size={18} /> Custo Estimado</CardHeader>
          <StatValue>R$ {estimatedCost.toFixed(2)}</StatValue>
        </Card>

        <Card delay={0.3}>
          <CardHeader><Target size={18} /> Meta Mensal</CardHeader>
          <StatValue>{residence.monthly_goal_kwh}<span>kWh</span></StatValue>
          <ProgressBar>
            <ProgressFill percentage={Math.min(goalProgress, 100)} />
          </ProgressBar>
        </Card>

        <Card delay={0.4}>
          <CardHeader><Home size={18} /> Resumo da Residência</CardHeader>
          <SummaryGrid>
            <SummaryItem><span>Moradores</span><strong>{residence.residents}</strong></SummaryItem>
            <SummaryItem><span>Cômodos</span><strong>{residence.rooms}</strong></SummaryItem>
          </SummaryGrid>
        </Card>

        <Card delay={0.5}>
            <CardHeader><Lightbulb size={18} /> Dica de Economia</CardHeader>
            <p style={{ flexGrow: 1 }}>{tip.content}</p>
            <StyledLink to="/app/dicas">Ver mais dicas</StyledLink>
        </Card>

        <Card delay={0.6}>
          <CardHeader><Settings size={18}/> Ações Rápidas</CardHeader>
          <div>
            <ActionButton to="/app/residencia">
              <span>Configurar Residência</span>
              <ArrowRight size={18} />
            </ActionButton>
            <ActionButton to="/app/historico">
              <span>Ver Histórico Detalhado</span>
              <ArrowRight size={18} />
            </ActionButton>
          </div>
        </Card>

        {residence.monthly_goal_kwh > 0 && (
          <Alert isGood={isWithinGoal}>
            {isWithinGoal ? <Zap size={20} /> : <AlertCircle size={20} />}
            {isWithinGoal
              ? "Parabéns! Você está dentro da meta de consumo."
              : "Atenção! Seu consumo já ultrapassou a meta deste mês."}
          </Alert>
        )}
      </Grid>
    </PageWrapper>
  );
};

export default DashboardHome;