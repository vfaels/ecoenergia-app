import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { 
  Calculator, Zap, Calendar, DollarSign, CheckSquare, Square, 
  Tv, Refrigerator, Laptop, Bed, WashingMachine, HelpCircle 
} from 'lucide-react';
import api from '../../services/api';

// --- Tipagens ---
interface Appliance {
  id: number;
  name: string;
  power_watts: number;
  category: string;
}

interface SimulationInput {
  hoursPerDay: number;
  daysPerWeek: number;
}

type SimulationState = Record<string, SimulationInput>;

// --- Estilização ---
const SimulatorWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
  h1 { font-size: 2.5rem; font-weight: 800; color: ${({ theme }) => theme.text}; transition: all 0.7s ease;}
  p { font-size: 1.2rem; color: ${({ theme }) => theme.textSecondary}; transition: all 0.7s ease;}
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  border-radius: 16px;
  padding: 2rem;
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
`;

const ApplianceSelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ApplianceRow = styled.div<{ isSelected: boolean }>`
  background-color: ${({ isSelected, theme }) => isSelected ? theme.bodySecondary : 'transparent'};
  border: 1px solid ${({ isSelected, theme }) => isSelected ? theme.primary : theme.borderColor};
  transition: all 0.7s ease;
  border-radius: 12px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
  transition: all 0.2s ease-in-out;
`;

const ApplianceDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  strong { 
    display: flex;
    align-items: center;
    gap: 0.5rem; 
    font-size: 1.1rem; 
    color: ${({ theme }) => theme.text}; 
    transition: all 0.7s ease;
  }
  
  span { 
    font-size: 0.9rem; 
    color: ${({ theme }) => theme.textSecondary}; 
    transition: all 0.7s ease;
    margin-top: 0.25rem;
  }
`;

const Checkbox = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  transition: all 0.7s ease;
`;

const UsageInputs = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  input {
    width: 70px;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.7s ease;
    text-align: center;
  }
`;

const ResultsCard = styled(Card)`
  position: sticky;
  top: 90px;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  & + & {
    margin-top: 1.5rem;
  }

  svg { color: ${({ theme }) => theme.primary}; flex-shrink: 0; transition: all 0.7s ease;}
  
  div {
    strong { font-size: 1.5rem; color: ${({ theme }) => theme.text}; display: block;transition: all 0.7s ease; }
    span { color: ${({ theme }) => theme.textSecondary};transition: all 0.7s ease; }
  }
`;

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'cozinha':
      return <Refrigerator size={18} />;
    case 'sala':
      return <Tv size={18} />;
    case 'quarto':
      return <Bed size={18} />;
    case 'lavanderia':
      return <WashingMachine size={18} />;
    case 'escritório':
      return <Laptop size={18} />;
    default:
      return <HelpCircle size={18} />;
  }
};

// --- Componente Principal ---
const Simulator = () => {
  const [allAppliances, setAllAppliances] = useState<Appliance[]>([]);
  const [simulationInputs, setSimulationInputs] = useState<SimulationState>({});
  const [kwhCost, setKwhCost] = useState(0.75);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appliancesRes, residenceRes] = await Promise.all([
          api.get('/appliances'),
          api.get('/residence/me')
        ]);
        const flatList = Object.values(appliancesRes.data).flat() as Appliance[];
        setAllAppliances(flatList);
        if (residenceRes.data.kwh_cost) {
          setKwhCost(residenceRes.data.kwh_cost);
        }
      } catch (error) {
        console.error("Erro ao buscar dados para o simulador:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectionChange = (applianceId: number) => {
    setSimulationInputs(prev => {
      const newInputs = { ...prev };
      if (newInputs[applianceId]) {
        delete newInputs[applianceId]; // Desseleciona
      } else {
        newInputs[applianceId] = { hoursPerDay: 1, daysPerWeek: 7 }; // Seleciona com valores padrão
      }
      return newInputs;
    });
  };

  const handleInputChange = (applianceId: number, field: keyof SimulationInput, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setSimulationInputs(prev => ({
      ...prev,
      [applianceId]: {
        ...prev[applianceId],
        [field]: numValue
      }
    }));
  };

  const simulationResults = useMemo(() => {
    let totalKwhPerMonth = 0;

    for (const applianceId in simulationInputs) {
      const appliance = allAppliances.find(a => a.id === parseInt(applianceId));
      const inputs = simulationInputs[applianceId];

      if (appliance && inputs) {
        const kwhPerDay = (appliance.power_watts * inputs.hoursPerDay) / 1000;
        const kwhPerWeek = kwhPerDay * inputs.daysPerWeek;
        const kwhPerMonth = kwhPerWeek * 4.345; // Média de semanas em um mês
        totalKwhPerMonth += kwhPerMonth;
      }
    }

    return {
      dailyKwh: totalKwhPerMonth / 30.4,
      weeklyKwh: totalKwhPerMonth / 4.345,
      monthlyKwh: totalKwhPerMonth,
      monthlyCost: totalKwhPerMonth * kwhCost,
    };
  }, [simulationInputs, allAppliances, kwhCost]);

  return (
    <SimulatorWrapper>
      <Header>
        <h1>Simulador de Consumo</h1>
        <p>Selecione seus aparelhos e informe o tempo de uso para uma estimativa de gastos.</p>
      </Header>
      <MainGrid>
        <Card>
          <CardTitle>Selecione os Aparelhos</CardTitle>
          <ApplianceSelectionList>
            {allAppliances.map(appliance => {
              const isSelected = !!simulationInputs[appliance.id];
              return (
                <ApplianceRow key={appliance.id} isSelected={isSelected}>
                  <Checkbox onClick={() => handleSelectionChange(appliance.id)}>
                    {isSelected ? <CheckSquare size={24}/> : <Square size={24}/>}
                  </Checkbox>
                  <ApplianceDetails>
                    <strong>
                      {getCategoryIcon(appliance.category)}
                      {appliance.name}
                    </strong>
                    <span>{appliance.power_watts} W</span>
                  </ApplianceDetails>
                  {isSelected && (
                    <UsageInputs>
                      <input type="number" min="0" max="24" value={simulationInputs[appliance.id].hoursPerDay} onChange={e => handleInputChange(appliance.id, 'hoursPerDay', e.target.value)} />
                      <label>horas/dia</label>
                      <input type="number" min="0" max="7" value={simulationInputs[appliance.id].daysPerWeek} onChange={e => handleInputChange(appliance.id, 'daysPerWeek', e.target.value)} />
                      <label>dias/sem</label>
                    </UsageInputs>
                  )}
                </ApplianceRow>
              )
            })}
          </ApplianceSelectionList>
        </Card>
        
        <ResultsCard>
          <CardTitle><Calculator/> Resultado da Simulação</CardTitle>
          <ResultItem>
            <Zap size={24}/>
            <div>
              <strong>{simulationResults.dailyKwh.toFixed(2)} kWh</strong>
              <span>Consumo Diário Estimado</span>
            </div>
          </ResultItem>
          <ResultItem>
            <Calendar size={24}/>
            <div>
              <strong>{simulationResults.weeklyKwh.toFixed(2)} kWh</strong>
              <span>Consumo Semanal Estimado</span>
            </div>
          </ResultItem>
          <ResultItem>
            <DollarSign size={24}/>
            <div>
              <strong>R$ {simulationResults.monthlyCost.toFixed(2)}</strong>
              <span>Custo Mensal Estimado</span>
            </div>
          </ResultItem>
        </ResultsCard>
      </MainGrid>
    </SimulatorWrapper>
  );
};

export default Simulator;