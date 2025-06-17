import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { PlusCircle, Trash2, TrendingUp } from 'lucide-react';

// --- Tipagem para cada item do simulador ---
interface ApplianceItem {
  id: number;
  name: string;
  power: number; // em Watts
  hoursPerDay: number;
  daysPerMonth: number;
}

// --- Lista de aparelhos pré-definidos para o usuário escolher ---
const predefinedAppliances = [
  { name: 'Ar Condicionado (12.000 BTUs)', power: 1500 },
  { name: 'Chuveiro Elétrico', power: 5500 },
  { name: 'Geladeira (Duplex)', power: 150 },
  { name: 'Lâmpada LED (10W)', power: 10 },
  { name: 'Micro-ondas', power: 1200 },
  { name: 'Televisão (LED 42")', power: 120 },
  { name: 'Computador (Desktop)', power: 300 },
  { name: 'Notebook', power: 60 },
  { name: 'Máquina de Lavar', power: 500 },
];

const KWH_PRICE = 0.85;

// --- COMPONENTES ESTILIZADOS ---
const SimulatorWrapper = styled.div`
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
  position: relative;
  overflow: hidden;
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

const AddApplianceForm = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1.5rem;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.bodySecondary};
  border-radius: 12px;
`;

const InputGroup = styled.div`
  label {
    display: block;
    font-weight: 500;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem;
  cursor: pointer;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  font-weight: 600;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
  }
`;

const ApplianceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ApplianceRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bodySecondary};
  transition: all 0.2s ease;
  
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: #dc2626;
    background-color: rgba(220, 38, 38, 0.1);
  }
`;

const ResultsCard = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  color: ${({ theme }) => theme.text};
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ResultsHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text};
`;

const ResultsSubtitle = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${({ theme }) => theme.textSecondary};
`;

const ResultItem = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.5rem 0;
  span {
    font-weight: 400;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const Simulator = () => {
  const [appliances, setAppliances] = useState<ApplianceItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hours, setHours] = useState('1');
  const [days, setDays] = useState('30');

  const handleAddAppliance = () => {
    const selectedApplianceData = predefinedAppliances[selectedIndex];
    const hoursNum = parseFloat(hours);
    const daysNum = parseFloat(days);
    if (!selectedApplianceData || !hoursNum || hoursNum <= 0 || !daysNum || daysNum <= 0) return;
    
    const newAppliance: ApplianceItem = {
      id: Date.now(),
      name: selectedApplianceData.name,
      power: selectedApplianceData.power,
      hoursPerDay: hoursNum,
      daysPerMonth: daysNum,
    };
    setAppliances([...appliances, newAppliance]);
  };

  const handleRemoveAppliance = (id: number) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const totalMonthlyKwh = useMemo(() => {
    return appliances.reduce((total, item) => {
      const consumptionKwh = (item.power * item.hoursPerDay * item.daysPerMonth) / 1000;
      return total + consumptionKwh;
    }, 0);
  }, [appliances]);

  const estimatedCost = useMemo(() => {
    const cost = totalMonthlyKwh * KWH_PRICE;
    return cost.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  }, [totalMonthlyKwh]);

  return (
    <SimulatorWrapper>
      <Header>
        <h1>Simulador de Consumo</h1>
        <p>Adicione eletrodomésticos para estimar o seu consumo mensal.</p>
      </Header>

      <Card>
        <AddApplianceForm>
          <InputGroup>
            <label htmlFor="appliance">Eletrodoméstico</label>
            <Select 
              id="appliance" 
              value={selectedIndex} 
              onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
            >
              {predefinedAppliances.map((app, index) => (
                <option key={index} value={index}>{app.name}</option>
              ))}
            </Select>
          </InputGroup>
          
          <InputGroup>
            <label htmlFor="hours">Horas de uso/dia</label>
            <Input 
              id="hours" 
              type="number" 
              min="0" 
              value={hours} 
              onChange={(e) => setHours(e.target.value)}
            />
          </InputGroup>
          
          <InputGroup>
            <label htmlFor="days">Dias de uso/mês</label>
            <Input 
              id="days" 
              type="number" 
              min="0" 
              max="31" 
              value={days} 
              onChange={(e) => setDays(e.target.value)}
            />
          </InputGroup>
          
          <AddButton onClick={handleAddAppliance} title="Adicionar aparelho">
            <PlusCircle size={20} />
          </AddButton>
        </AddApplianceForm>

        <ApplianceList>
          {appliances.map(app => (
            <ApplianceRow key={app.id}>
              <span>{app.name}</span>
              <span>{app.power} W</span>
              <span>{app.hoursPerDay}h/dia</span>
              <span>{app.daysPerMonth} dias/mês</span>
              <RemoveButton onClick={() => handleRemoveAppliance(app.id)} title="Remover aparelho">
                <Trash2 size={18} />
              </RemoveButton>
            </ApplianceRow>
          ))}
        </ApplianceList>
      </Card>

      {appliances.length > 0 && (
        <ResultsCard>
          <ResultsHeader>
            <TrendingUp size={28} />
            Resultado da Simulação
          </ResultsHeader>
          <ResultsSubtitle>
            O consumo mensal estimado para os aparelhos listados é de:
          </ResultsSubtitle>
          <div>
            <ResultItem>
              Consumo: <span>{totalMonthlyKwh.toFixed(2)} kWh/mês</span>
            </ResultItem>
            <ResultItem>
              Custo Estimado: <span>{estimatedCost}</span>
            </ResultItem>
          </div>
        </ResultsCard>
      )}
    </SimulatorWrapper>
  );
};

export default Simulator;