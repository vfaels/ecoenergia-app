// src/pages/dashboard/DashboardHome.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Zap, Users, Home, Lightbulb } from "lucide-react";
import { fetchDashboardData } from '../../services/api'
import styled, { useTheme } from "styled-components";
import { BarChart3 } from "lucide-react";

// --- Tipagem dos Dados ---
interface ResidenceConfig {
  residents: number;
  rooms: number;
}

interface DailyData {
  day: string;
  consumo: number;
}

interface ConsumptionHistory {
  today_kwh: number;
  last_7_days: DailyData[];
}

interface Tip {
  id: number;
  title: string;
}

// --- COMPONENTES ESTILIZADOS ---

const DashboardWrapper = styled.div`
  width: 100%;
`;

const WelcomeHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }
  p {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const DashboardCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  svg {
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
  }
`;

// --- COMPONENTE PRINCIPAL ---

const DashboardHome = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [residence, setResidence] = useState<ResidenceConfig | null>(null);
  const [consumption, setConsumption] = useState<ConsumptionHistory | null>(
    null
  );
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
  fetchDashboardData().then((data: {
    residence: ResidenceConfig;
    consumption: ConsumptionHistory;
    tips: Tip[];
  }) => {
    setResidence(data.residence);
    setConsumption(data.consumption);
    setTips(data.tips);
  });
}, []);

  return (
    <DashboardWrapper>
      <WelcomeHeader>
        <h1>Olá, {user?.name}!</h1>
        <p>Aqui está o resumo do seu consumo de energia.</p>
      </WelcomeHeader>

      <DashboardGrid>
        <DashboardCard style={{ gridColumn: "span 2", minHeight: "350px" }}>
          {/* O ícone BarChart3 é usado aqui, e o componente de gráfico BarChart é usado abaixo */}
          <CardTitle>
            <BarChart3 />
            Consumo da Semana
          </CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            {/* AGORA USAMOS A CONSTANTE 'theme' PARA PASSAR AS CORES */}
            <BarChart data={consumption?.last_7_days}>
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
              />
              <YAxis
                tick={{ fill: theme.textSecondary }}
                axisLine={{ stroke: theme.borderColor }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: `${theme.primary}20` }} // Adiciona um fundo sutil ao passar o mouse
                contentStyle={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.borderColor,
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="consumo"
                fill={theme.primary}
                name="Consumo (kWh)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        {/* Card: Consumo de Hoje */}
        <DashboardCard>
          <CardTitle>
            <Zap />
            Consumo de Hoje
          </CardTitle>
          <Stat>
            <h4>{consumption?.today_kwh || 0}</h4>
            <p>kWh</p>
          </Stat>
        </DashboardCard>

        {/* Card: Configuração da Residência */}
        <DashboardCard>
          <CardTitle>
            <Home />
            Minha Residência
          </CardTitle>
          <InfoGrid>
            <InfoItem>
              <Users /> <span>{residence?.residents || 0} Moradores</span>
            </InfoItem>
            <InfoItem>
              <Home /> <span>{residence?.rooms || 0} Cômodos</span>
            </InfoItem>
          </InfoGrid>
        </DashboardCard>

        {/* Card: Dicas Recentes */}
        <DashboardCard style={{ gridColumn: "span 2" }}>
          <CardTitle>
            <Lightbulb />
            Dicas Recentes
          </CardTitle>
          <TipList>
            {tips.slice(0, 2).map((tip) => (
              <li key={tip.id}>💡 {tip.title}</li>
            ))}
          </TipList>
        </DashboardCard>
      </DashboardGrid>
    </DashboardWrapper>
  );
};

export default DashboardHome;
