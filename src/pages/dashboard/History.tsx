import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Zap, DollarSign, BarChartHorizontal } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../contexts/themeContext';

interface HistoryData { date: string; kwh: number; }
interface ResidenceConfig { kwh_cost: number; }

const PageWrapper = styled.div` animation: fadeIn 0.5s ease-in-out; `;

const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;
const FilterButton = styled.button<{ isActive: boolean }>`
  background-color: ${({ isActive, theme }) => isActive ? theme.primary : theme.cardBg};
  color: ${({ isActive, theme }) => isActive ? 'white' : theme.text};
  border: 1px solid ${({ isActive, theme }) => isActive ? theme.primary : theme.borderColor};
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.7s ease;
  &:hover { background-color: ${({ theme }) => theme.primaryHover}; color: white; border-color: ${({ theme }) => theme.primaryHover}; transition: all 0.7s ease; }
`;
const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  border-radius: 16px;
  padding: 1.5rem;
  h4 { margin: 0 0 0.5rem 0; color: ${({ theme }) => theme.textSecondary}; transition: all 0.7s ease; }
  p { margin: 0; font-size: 2rem; font-weight: 700; color: ${({ theme }) => theme.primary}; transition: all 0.7s ease; }
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  border-radius: 16px;
  padding: 2rem;
  height: 400px;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
    transition: all 0.7s ease;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: all 0.7s ease;
    opacity: 0.9;
  }
`;

const History = () => {
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [config, setConfig] = useState<ResidenceConfig | null>(null);
  const [,setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('30d'); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyRes, configRes] = await Promise.all([
          api.get(`/consumption/history?period=${activePeriod}`), 
          api.get('/residence/me')
        ]);
        setHistory(historyRes.data);
        setConfig(configRes.data);
      } catch (error) {
        console.error("Falha ao buscar dados do histórico:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activePeriod]); 

  const summaryStats = useMemo(() => {
    const totalKwh = history.reduce((sum, item) => sum + Number(item.kwh), 0);
    const totalDays = history.length;
    const averageKwh = totalDays > 0 ? totalKwh / totalDays : 0;
    const totalCost = totalKwh * (config?.kwh_cost || 0);
    return { totalKwh, averageKwh, totalCost };
  }, [history, config]);

  const formattedChartData = useMemo(() => {
    const grouped: Record<string, number> = {};

    history.forEach((item) => {
      const dateKey = new Date(item.date).toISOString().split('T')[0]; // '2025-07-02'
      if (!grouped[dateKey]) {
        grouped[dateKey] = 0;
      }
      grouped[dateKey] += Number(item.kwh);
    });

    return Object.entries(grouped).map(([date, kwh]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      kwh
    }));
  }, [history]);

  return (
    <PageWrapper>
      <Header><h1>Histórico de Consumo</h1><p>Analise detalhada do seu consumo ao longo do tempo.</p></Header>
      
      <FilterBar>
        <FilterButton isActive={activePeriod === '7d'} onClick={() => setActivePeriod('7d')}>Últimos 7 dias</FilterButton>
        <FilterButton isActive={activePeriod === '30d'} onClick={() => setActivePeriod('30d')}>Últimos 30 dias</FilterButton>
        <FilterButton isActive={activePeriod === 'this_month'} onClick={() => setActivePeriod('this_month')}>Este Mês</FilterButton>
      </FilterBar>

      <SummaryGrid>
        <SummaryCard><h4><Zap />Total Consumido</h4><p>{summaryStats.totalKwh.toFixed(2)} kWh</p></SummaryCard>
        <SummaryCard><h4><DollarSign/>Custo Total</h4><p>R$ {summaryStats.totalCost.toFixed(2)}</p></SummaryCard>
        <SummaryCard><h4><BarChartHorizontal/>Média Diária</h4><p>{summaryStats.averageKwh.toFixed(2)} kWh</p></SummaryCard>
      </SummaryGrid>

      <ChartCard>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedChartData} margin={{ top: 5, right: 20, left: 0, bottom: -15 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.borderColor}/>
            <XAxis dataKey="date" tick={{ fill: theme.textSecondary }} />
            <YAxis unit=" kWh" tick={{ fill: theme.textSecondary }} />
            <Tooltip contentStyle={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}/>
            <Legend />
            <Line type="monotone" dataKey="kwh" name="Consumo (kWh)" stroke={theme.primary} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </PageWrapper>
  );
};

export default History;