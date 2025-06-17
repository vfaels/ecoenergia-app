import { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import api from '../../services/api';

// Tipagem dos dados
interface DailyData {
  date: string;
  kwh: number;
}

interface ConsumptionData {
  last_30_days: DailyData[];
}

interface ResidenceConfig {
  kwh_cost: number;
}

// Estilização dos componentes
const HistoryWrapper = styled.div`
  width: 100%;
`;

const Header = styled.div`
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

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  }
  th {
    text-transform: uppercase;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

// Componente principal
const History = () => {
  const theme = useTheme();
  const [consumption, setConsumption] = useState<ConsumptionData | null>(null);
  const [config, setConfig] = useState<ResidenceConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [consumptionRes, configRes] = await Promise.all([
          api.get('/consumption_history'),
          api.get('/residence_config')
        ]);
        setConsumption(consumptionRes.data);
        setConfig(configRes.data);
      } catch (error) {
        console.error("Falha ao buscar dados do histórico:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedChartData = consumption?.last_30_days.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  })) || [];

  return (
    <HistoryWrapper>
      <Header>
        <h1>Histórico de Consumo</h1>
        <p>Analise seus gastos diários e a evolução do seu consumo de energia.</p>
      </Header>

      <Card>
        <CardTitle>
          <TrendingUp />
          Evolução do Consumo (Últimos 30 dias)
        </CardTitle>
        {isLoading ? (
          <p>Carregando gráfico...</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={formattedChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.borderColor} />
              <XAxis dataKey="date" tick={{ fill: theme.textSecondary }} axisLine={{ stroke: theme.borderColor }} tickLine={false} />
              <YAxis unit=" kWh" tick={{ fill: theme.textSecondary }} axisLine={{ stroke: theme.borderColor }} tickLine={false} />
              <Tooltip
                cursor={{ stroke: theme.primary, strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.borderColor,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="kwh" stroke={theme.primary} strokeWidth={2} name="Consumo" dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card>
        <CardTitle>
          <Calendar />
          Detalhes do Consumo Diário
        </CardTitle>
        {isLoading ? (
          <p>Carregando dados...</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Consumo (kWh)</th>
                <th>Custo Estimado (R$)</th>
              </tr>
            </thead>
            <tbody>
              {/* Usamos slice().reverse() para mostrar os dias mais recentes primeiro */}
              {consumption?.last_30_days.slice().reverse().map(item => (
                <tr key={item.date}>
                  <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                  <td>{item.kwh.toFixed(2)}</td>
                  <td>R$ {(item.kwh * (config?.kwh_cost || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </HistoryWrapper>
  );
};;

export default History;