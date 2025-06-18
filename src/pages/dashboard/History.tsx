import { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import api from '../../services/api';

interface HistoryData {
  date: string;
  kwh: number;
}
interface ConfigData {
  kwh_cost: number;
}

const HistoryWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
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

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
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

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  
  th, td {
    padding: 1.25rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textSecondary};
    background: rgba(255, 255, 255, 0.05);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: rgba(255, 255, 255, 0.05);
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

const History = () => {
  const theme = useTheme();
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Chamadas para as novas rotas da API real
        const [historyRes, configRes] = await Promise.all([
          api.get('/consumption/history'),
          api.get('/residence/me') // Usamos a mesma rota da residência para pegar o kwh_cost
        ]);
        setHistory(historyRes.data);
        setConfig(configRes.data);
      } catch (error) {
        console.error("Falha ao buscar dados do histórico:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedChartData = history.map(d => ({
    ...d,
    // Formata a data para exibição no gráfico
    date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    kwh: Number(d.kwh)
  }));

  if (isLoading) return <LoadingState>Carregando histórico...</LoadingState>;

  return (
    <HistoryWrapper>
      <Header>
        <h1>Histórico de Consumo</h1>
        <p>Análise detalhada do seu consumo de energia ao longo do tempo</p>
      </Header>
      <Card>
        <CardTitle><TrendingUp /> Evolução do Consumo (Últimos 30 dias)</CardTitle>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedChartData}>
              {/* Configs do Gráfico */}
              <XAxis dataKey="date" />
              <YAxis unit=" kWh" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kwh" name="Consumo (kWh)" stroke={theme.primary} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>
      <Card>
        <CardTitle><Calendar /> Detalhes do Consumo Diário</CardTitle>
        <Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Consumo (kWh)</th>
              <th>Custo Estimado</th>
            </tr>
          </thead>
          <tbody>
            {history.slice().reverse().map(item => (
              <tr key={item.date}>
                <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                <td>{Number(item.kwh).toFixed(2)}</td>
                <td>R$ {(Number(item.kwh) * (config?.kwh_cost || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </HistoryWrapper>
  );
};

export default History;