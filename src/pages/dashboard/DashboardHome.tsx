import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import api from '../../services/api';
import styled, { useTheme } from "styled-components";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Zap, Users, Home, Lightbulb, BarChart3 } from "lucide-react";

interface ResidenceData {
  residents: number;
  rooms: number;
}
interface ConsumptionData {
  today_kwh: number;
  last_7_days: { date: string; consumo: number }[];
}
interface TipData {
  id: number;
  title: string;
}

// --- COMPONENTES ESTILIZADOS ---

const DashboardWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const WelcomeHeader = styled.header`
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
    opacity: 0.9;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  position: relative;
  padding-bottom: 2rem;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.borderColor};
  }
  
`;

const DashboardCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.primary};
    border-radius: 16px 16px 0 0;
  }
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  
  svg {
    size: 32px;
    color: ${({ theme }) => theme.primary};
  }
`;

const Stat = styled.div`
  text-align: center;
  h4 {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
  }
  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  svg {
    color: ${({ theme }) => theme.textSecondary};
    width: 20px;
  }
  span {
    font-weight: 600;
  }
`;

const TipList = styled.ul`
  list-style: none;
  padding: 0;
  li {
    margin-bottom: 0.75rem;
    font-size: 1rem;
    padding-left: 1.5rem;
    position: relative;
    
    &::before {
      content: '💡';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textSecondary};
`;

// --- COMPONENTE PRINCIPAL ---

const DashboardHome = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const [residence, setResidence] = useState<ResidenceData | null>(null);
  const [consumption, setConsumption] = useState<ConsumptionData | null>(null);
  const [tips, setTips] = useState<TipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const tipsRes = await api.get('/tips');
        setTips(tipsRes.data);
      } catch (error) {
        console.error("Dashboard: Falha ao buscar dicas.", error);
      }
      try {
        const residenceRes = await api.get('/residence/me');
        setResidence(residenceRes.data);
      } catch (error) {
        console.error("Dashboard: Falha ao buscar dados da residência.", error);
      }
      try {
        const consumptionRes = await api.get('/consumption/summary');
        setConsumption(consumptionRes.data);
      } catch (error) {
        console.error("Dashboard: Falha ao buscar resumo do consumo.", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const formattedChartData = consumption?.last_7_days.map(d => ({
  ...d,
  day: new Date(d.date).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
  consumo: Number(d.consumo)
})) || [];

  if (isLoading) {
    return <LoadingState>Carregando dados do dashboard...</LoadingState>;
  }

  return (
    <DashboardWrapper>
      <WelcomeHeader>
        <h1>Olá, {user?.name}!</h1>
        <p>Aqui está o resumo do seu consumo de energia.</p>
      </WelcomeHeader>

      <DashboardGrid>
        <DashboardCard style={{ gridColumn: "span 2", minHeight: "350px" }}>
          <CardTitle>
            <BarChart3 />
            Consumo da Semana
          </CardTitle>
          {isLoading ? (
            <LoadingState>Carregando dados...</LoadingState>
          ) : (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedChartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={theme.borderColor} 
                  />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: theme.textSecondary }} 
                    axisLine={{ stroke: theme.borderColor }} 
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fill: theme.textSecondary }} 
                    axisLine={{ stroke: theme.borderColor }} 
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ stroke: theme.primary, strokeWidth: 2 }}
                    contentStyle={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.borderColor,
                      borderRadius: '12px',
                      padding: '1rem'
                    }}
                    labelFormatter={(value) => `Dia: ${value}`}
                    formatter={(value) => [`Consumo: ${value} kWh`]}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '1rem'
                    }}
                  />
                  <Bar
                    dataKey="consumo"
                    fill={theme.primary}
                    name="Consumo (kWh)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </DashboardCard>

        <DashboardCard>
          <CardTitle>
            <Zap />
            Consumo de Hoje
          </CardTitle>
          {isLoading ? (
            <LoadingState>Carregando dados...</LoadingState>
          ) : (
            <Stat>
              <h4>{consumption?.today_kwh || 0}</h4>
              <p>kWh</p>
            </Stat>
          )}
        </DashboardCard>

        <DashboardCard>
          <CardTitle>
            <Home />
            Minha Residência
          </CardTitle>
          {isLoading ? (
            <LoadingState>Carregando dados...</LoadingState>
          ) : (
            <InfoGrid>
              <InfoItem>
                <Users /> <span>{residence?.residents || 0} Moradores</span>
              </InfoItem>
              <InfoItem>
                <Home /> <span>{residence?.rooms || 0} Cômodos</span>
              </InfoItem>
            </InfoGrid>
          )}
        </DashboardCard>

        <DashboardCard style={{ gridColumn: "span 2" }}>
          <CardTitle>
            <Lightbulb />
            Dicas Recentes
          </CardTitle>
          {isLoading ? (
            <LoadingState>Carregando dados...</LoadingState>
          ) : (
            <TipList>
              {tips.slice(0, 2).map((tip) => (
                <li key={tip.id}>{tip.title}</li>
              ))}
            </TipList>
          )}
        </DashboardCard>
      </DashboardGrid>
    </DashboardWrapper>
  );
};

export default DashboardHome;