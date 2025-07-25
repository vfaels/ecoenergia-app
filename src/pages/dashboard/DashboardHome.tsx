import { useState, useEffect, type JSX } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { 
  Zap, DollarSign, Target, Home, Lightbulb, AlertCircle, Settings, ArrowRight,
  ChefHat, Droplets, Bed, Tv, WashingMachine, Users, DoorOpen, Plug, MapPin
} from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import api from '../../services/api';

// --- Interfaces e Tipagens ---
interface Tip {
  title: string;
  description: string;
  category: string;
}

interface Appliance {
  id: number;
  name: string;
}

type GroupedAppliances = Record<string, Appliance[]>;

interface DashboardData {
  consumption: { current_month_kwh: number };
  residence: { 
    kwh_cost: number; 
    monthly_goal_kwh: number; 
    residents: number; 
    rooms: number;
    city: string;
    state: string;
  };
  tip: Tip;
  appliances: GroupedAppliances; 
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
  transition: background-color 0.7s ease, color 0.7s ease;
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
  transition: background-color 0.7s ease, border 0.7s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${({ theme }) => theme.primary};
    transition: background 0.6s ease;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 600;
  transition: color 0.7s ease;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  transition: color 0.7s ease;
  
  span {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-left: 0.5rem;
    transition: color 0.7s ease;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  overflow: hidden;
  margin-top: auto; 
  transition: background 0.7s ease;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  transition: width 0.5s ease-in-out, background-color 0.7s ease;
  box-shadow: ${({ theme }) => `0 2px 4px ${theme.primary}40`};

`;

const StyledLink = styled(Link)`
  margin-top: auto; 
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  align-self: flex-end;
  transition: color 0.7s ease;
  &:hover { text-decoration: underline; }
`;

const Alert = styled.div<{ isGood: boolean }>`
  grid-column: 1 / -1;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background-color: ${({ isGood, theme }) => isGood ? `${theme.primary}20` : '#fdecea'};
  color: ${({ isGood, theme }) => isGood ? theme.primary : '#b71c1c'};
  border: 1px solid ${({ isGood, theme }) => isGood ? theme.primary : '#f5c6cb'};
  transition: background-color 0.7s ease, color 0.7s ease, border: 0.7s ease;
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
  transition: background-color 0.7s ease, color 0.7s ease, border: 0.7s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    transform: translateX(5px);
    transition: border-color 0.7s ease, color 0.7s ease;
  }

  & + & {
    margin-top: 1rem;
  }
`;

const TipContentWrapper = styled.div`
  flex-grow: 1; /* Faz este wrapper ocupar o espaço disponível */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TipCategory = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  text-transform: uppercase;
`;

const TipTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const TipDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1; /* Ocupa o espaço disponível no card */
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.primary};
    flex-shrink: 0;
  }

  span {
    flex-grow: 1;
  }

  strong {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }
`;

// --- Componente Principal ---

const categoryIcons: { [key: string]: JSX.Element } = {
  Geral: <Home size={14} />,
  Cozinha: <ChefHat size={14} />,
  Quarto: <Bed size={14} />,
  Sala: <Tv size={14} />,
  Banheiro: <Droplets size={14} />,
  Lavanderia: <WashingMachine size={14} />,
};

const DashboardHome = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [consumptionRes, residenceRes, tipsRes, appliancesRes] = await Promise.all([
          api.get('/consumption/summary'),
          api.get('/residence/me'),
          api.get('/tips'),
          api.get('/appliances')
        ]);
        
        setData({
          consumption: consumptionRes.data,
          residence: residenceRes.data,
          tip: tipsRes.data[Math.floor(Math.random() * tipsRes.data.length)],
          appliances: appliancesRes.data
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <PageWrapper><p>Carregando dashboard...</p></PageWrapper>;
  if (!data) return <PageWrapper><p>Não foi possível carregar os dados.</p></PageWrapper>;

  const { consumption, residence, tip, appliances } = data;
  const estimatedCost = consumption.current_month_kwh * residence.kwh_cost;
  const goalProgress = residence.monthly_goal_kwh > 0
    ? (consumption.current_month_kwh / residence.monthly_goal_kwh) * 100
    : 0;
  const isWithinGoal = consumption.current_month_kwh <= residence.monthly_goal_kwh;

  const totalAppliances = Object.values(appliances).flat().length;

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
          <InfoList>
            <InfoRow>
              <MapPin />
              <span>Localização</span>
              <strong>{residence.city} - {residence.state}</strong>
            </InfoRow>
            <InfoRow>
              <Users />
              <span>Moradores</span>
              <strong>{residence.residents}</strong>
            </InfoRow>
            <InfoRow>
              <DoorOpen />
              <span>Cômodos</span>
              <strong>{residence.rooms}</strong>
            </InfoRow>
            <InfoRow>
              <Plug />
              <span>Aparelhos</span>
              <strong>{totalAppliances} cadastrados</strong>
            </InfoRow>
          </InfoList>
          <StyledLink to="/app/residencia">Gerenciar Residência</StyledLink>
        </Card>

        <Card delay={0.5}>
          <CardHeader><Lightbulb size={18} /> Dica de Economia</CardHeader>
          <TipContentWrapper>
            {tip ? (
              <>
                <TipCategory>
                  {categoryIcons[tip.category] || <Home size={14} />}
                  {tip.category}
                </TipCategory>
                <TipTitle>{tip.title}</TipTitle>
                <TipDescription>{tip.description}</TipDescription>
              </>
            ) : (
              <p>Nenhuma dica disponível no momento.</p>
            )}
          </TipContentWrapper>
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