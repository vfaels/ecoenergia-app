import { useState, useEffect, useMemo, type FormEvent } from 'react';
import styled from 'styled-components';
import { Home, Zap, Edit, PlusCircle, HelpCircle, Sticker, BookOpen, Search, Trash2, X, Settings, MapPin, DollarSign, DoorOpen, Target, Users } from 'lucide-react';
import api from '../../services/api';

interface Residence {
    residents: number;
    rooms: number;
    kwh_cost: number;
    monthly_goal_kwh: number;
    city: string;
    state: string;
}
interface Appliance {
  id: number;
  name: string;
  power_watts: number;
  category: string;
}
type GroupedAppliances = Record<string, Appliance[]>;

const SettingsWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
    transition: all 0.7s ease;
  }
  p {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: all 0.7s ease;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 1rem 1.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme, isActive }) => isActive ? theme.primary : theme.textSecondary};
  border-bottom: 3px solid ${({ isActive, theme }) => isActive ? theme.primary : 'transparent'};
  transition: all 0.7s ease;
  margin-bottom: -1px;

  &:hover {
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.7s ease-in-out;
`;

const CategoryHeader = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textSecondary};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    transition: all 0.7s ease;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 2rem;
  align-items: flex-start;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;
  max-width: 100%;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const ListCard = styled(Card)`
  min-width: 750px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  
  max-width: 900px;
  justify-self: start;
  
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;

  svg {
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

`;

const FormRow = styled.div`
  display: flex;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.7s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.body};
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.7s ease;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  align-items: left;
  gap: 0.5rem;
  transition: all 0.7s ease;
  margin-top: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
    transition: all 0.7s ease;
  }
`;

const ApplianceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;  
`;

const ApplianceItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.7s ease;

  &:hover {
    background-color: ${({ theme }) => theme.bodySecondary};
    transition: all 0.7s ease;
  }
`;

const ApplianceInfo = styled.div`
  strong {
    color: ${({ theme }) => theme.text};
    transition: all 0.7s ease;
  }
  div {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: all 0.7s ease;
    font-size: 0.9em;
    margin-top: 0.25rem;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.7s ease;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;

  &:hover {
    background-color: ${({ theme }) => theme.cardBg};
    color: #e53e3e;
    transition: all 0.7s ease;
  }
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TipItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textSecondary};
  background-color: ${({ theme }) => theme.bodySecondary};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.7s ease;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.textSecondary};
  border: 2px dashed ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  transition: all 0.7s ease;
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  transition: all 0.7s ease;

  &:hover {
    background-color: ${({ theme }) => theme.cardBg};
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.secondary};
  margin-top: 0.5rem;
  transition: all 0.7s ease;

  &:hover {
    background-color: ${({ theme }) => theme.secondaryHover};
    transition: all 0.7s ease;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ClearFilterButton = styled.button`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.textSecondary};
  padding: 0.8rem;
  height: 100%;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.7s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    transition: all 0.7s ease;
  }
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;
  
  input {
    padding-left: 2.5rem;
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.textSecondary};
    transition: all 0.7s ease;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.body};
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.7s ease;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  /* 3 colunas em telas grandes */
  grid-template-columns: repeat(3, 1fr);

  /* 2 colunas em telas médias */
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 1 coluna em telas pequenas */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  background-color: ${({ theme }) => theme.bodySecondary};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.7s ease;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.7s ease;
  }

  strong {
    font-size: 1.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    transition: all 0.7s ease;
  }
`;

const brazilianStates = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];


export const ResidenceSettings = () => {
  const [activeTab, setActiveTab] = useState('geral');
  const [allAppliances, setAllAppliances] = useState<Appliance[]>([]);

  const [residence, setResidence] = useState<Residence>({ 
    residents: 0, 
    rooms: 0, 
    kwh_cost: 0, 
    monthly_goal_kwh: 0,
    city: '', 
    state: '' 
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [category, setCategory] = useState('Outros');
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  const applianceCategories = ['Todos', 'Cozinha', 'Sala', 'Quarto', 'Lavanderia', 'Escritório', 'Outros'];

  const fetchData = async () => {
    try {
      const [appliancesRes, residenceRes] = await Promise.all([
        api.get('/appliances'),
        api.get('/residence/me')
      ]);
      
      const groupedData: GroupedAppliances = appliancesRes.data;
      const flatList = Object.values(groupedData).flat();
      setAllAppliances(flatList);

      setResidence(prev => ({ ...prev, ...residenceRes.data }));
    } catch (error) {
      console.error("Erro ao buscar dados da página:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAndGroupedAppliances = useMemo(() => {
    const filtered = allAppliances
      .filter(appliance => selectedCategory === 'Todos' || appliance.category === selectedCategory)
      .filter(appliance => appliance.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return filtered.reduce<GroupedAppliances>((acc, current) => {
      const category = current.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(current);
      return acc;
    }, {});
  }, [allAppliances, searchTerm, selectedCategory]);

  const handleResidenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
        setResidence(prev => ({ ...prev, [name]: value }));
    } else {
        setResidence(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
  };
  
  const handleUpdateResidence = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.put('/residence/me', residence); 
      alert('Configurações da residência salvas com sucesso!');
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar configurações da residência:", error);
      alert("Não foi possível salvar as alterações.");
    }
  };

  const clearForm = () => {
    setName(''); setPower(''); setCategory('Outros'); setEditingAppliance(null);
  };
  
  const handleStartEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setName(appliance.name);
    setPower(String(appliance.power_watts));
    setCategory(appliance.category);
  };

  const handleApplianceSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name || !power || !category) return alert('Por favor, preencha todos os campos.');

    const applianceData = { name, power_watts: parseInt(power, 10), category };

    try {
      if (editingAppliance) {
        await api.put(`/appliances/${editingAppliance.id}`, applianceData);
      } else {
        await api.post('/appliances', applianceData);
      }
      clearForm();
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar aparelho:", error);
      alert('Não foi possível salvar o aparelho.');
    }
  };

  const handleDeleteAppliance = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este aparelho?')) {
      try {
        await api.delete(`/appliances/${id}`);
        fetchData();
      } catch (error) { console.error("Erro ao deletar aparelho:", error); }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
  };

  return (
    <SettingsWrapper>
      <Header>
        <h1>Configurar Residência</h1>
        <p>Gerencie as informações da sua casa e seus aparelhos.</p>
      </Header>
      <TabsContainer>
        <TabButton isActive={activeTab === 'geral'} onClick={() => setActiveTab('geral')}>Visão Geral</TabButton>
        <TabButton isActive={activeTab === 'configuracoes'} onClick={() => setActiveTab('configuracoes')}>Configurações</TabButton>
        <TabButton isActive={activeTab === 'aparelhos'} onClick={() => setActiveTab('aparelhos')}>Aparelhos</TabButton>
      </TabsContainer>
      <TabContent>

        {activeTab === 'geral' && (
            <Card>
                <CardTitle><Home /> Resumo da Residência</CardTitle>
                <SummaryGrid>
                    <SummaryItem>
                        <span><MapPin size={16}/> Localização</span>
                        <strong>{residence.city ? `${residence.city}, ${residence.state}` : 'Não informado'}</strong>
                    </SummaryItem>
                    <SummaryItem>
                        <span><Users size={16}/> Moradores</span>
                        <strong>{residence.residents}</strong>
                    </SummaryItem>
                    <SummaryItem>
                        <span><DoorOpen size={16}/> Cômodos</span>
                        <strong>{residence.rooms}</strong>
                    </SummaryItem>
                    <SummaryItem>
                        <span><DollarSign size={16}/> Custo do kWh</span>
                        <strong>R$ {Number(residence.kwh_cost).toFixed(4)}</strong>
                    </SummaryItem>
                    <SummaryItem>
                        <span><Target size={16}/> Meta Mensal</span>
                        <strong>{residence.monthly_goal_kwh} kWh</strong>
                    </SummaryItem>
                    <SummaryItem>
                        <span><Zap size={16}/> Aparelhos</span>
                        <strong>{allAppliances.length}</strong>
                    </SummaryItem>
                </SummaryGrid>
            </Card>
        )}

        {activeTab === 'configuracoes' && (
          <Card>
            <CardTitle><Settings />Configurações Gerais</CardTitle>
            <Form onSubmit={handleUpdateResidence}>
                <FormRow>
                    <FormGroup>
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" name="city" type="text" placeholder="Ex: Boa Vista" value={residence.city || ''} onChange={handleResidenceChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="state">Estado</Label>
                        <Select id="state" name="state" value={residence.state || ''} onChange={handleResidenceChange}>
                            <option value="" disabled>Selecione seu estado</option>
                            {brazilianStates.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </Select>
                    </FormGroup>
                </FormRow>
                <FormRow>
                    <FormGroup>
                        <Label htmlFor="residents">Moradores</Label>
                        <Input id="residents" name="residents" type="number" value={residence.residents || 0} onChange={handleResidenceChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="rooms">Cômodos</Label>
                        <Input id="rooms" name="rooms" type="number" value={residence.rooms || 0} onChange={handleResidenceChange} />
                    </FormGroup>
                </FormRow>
                <FormRow>
                    <FormGroup>
                        <Label htmlFor="kwh_cost">Custo por kWh (R$)</Label>
                        <Input id="kwh_cost" name="kwh_cost" type="number" step="0.0001" value={residence.kwh_cost || 0} onChange={handleResidenceChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="monthly_goal_kwh">Meta Mensal (kWh)</Label>
                        <Input id="monthly_goal_kwh" name="monthly_goal_kwh" type="number" value={residence.monthly_goal_kwh || 0} onChange={handleResidenceChange} />
                    </FormGroup>
                </FormRow>
                <Button type="submit">Salvar Configurações</Button>
            </Form>
          </Card>
        )}

        {activeTab === 'aparelhos' && (
          <ContentGrid>
            <aside>
              <Card as="section">
            <CardTitle>{editingAppliance ? <Edit /> : <PlusCircle />} {editingAppliance ? 'Editar Aparelho' : 'Adicionar Aparelho'}</CardTitle>
            <Form onSubmit={handleApplianceSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nome do Aparelho</Label>
                <Input id="name" type="text" placeholder="Ex: Geladeira" value={name} onChange={e => setName(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="power">Potência (em Watts)</Label>
                <Input id="power" type="number" placeholder="Ex: 150" value={power} onChange={e => setPower(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="category">Categoria</Label>
                <Select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                  {applianceCategories.filter(c => c !== 'Todos').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </Select>
              </FormGroup>
              <Button type="submit">{editingAppliance ? 'Salvar Alterações' : 'Adicionar'}</Button>
              {editingAppliance && (
                <SecondaryButton type="button" onClick={clearForm}>Cancelar Edição</SecondaryButton>
              )}
            </Form>
          </Card>
              <Card as="section" style={{ marginTop: '2rem' }}>
            <CardTitle><HelpCircle />Como Encontrar os Watts?</CardTitle>
            <TipsList>
              <TipItem><Sticker size={18} />Procure por uma etiqueta no próprio aparelho (geralmente na parte de trás ou embaixo).</TipItem>
              <TipItem><BookOpen size={18} />Consulte o manual de instruções do produto.</TipItem>
              <TipItem><Search size={18} />Pesquise online pelo modelo do seu aparelho + a palavra "potência" ou "watts".</TipItem>
            </TipsList>
          </Card>
            </aside>
            <ListCard as="main">
          <CardTitle><Zap />Meus Aparelhos</CardTitle>
          <FilterBar>
            <SearchInput>
              <Search size={18} />
              <Input 
                type="text"
                placeholder="Nome do aparelho"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </SearchInput>
            <Select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {applianceCategories.map(cat => <option key={cat} value={cat}>{cat === 'Todos' ? 'Todas as Categorias' : cat}</option>)}
            </Select>
            {(searchTerm || selectedCategory !== 'Todos') && (
              <ClearFilterButton onClick={handleClearFilters}>
                <X size={16} />
                Limpar
              </ClearFilterButton>
            )}
          </FilterBar>

          {Object.keys(filteredAndGroupedAppliances).length > 0 ? (
            Object.keys(filteredAndGroupedAppliances).sort().map(categoryKey => (
                <div key={categoryKey}>
                    <CategoryHeader>{categoryKey}</CategoryHeader> 
                    <ApplianceList>
                        {filteredAndGroupedAppliances[categoryKey].map(appliance => (
                            <ApplianceItem key={appliance.id}>
                                <ApplianceInfo>
                                    <strong>{appliance.name}</strong>
                                    <div><Zap size={12} /> {appliance.power_watts} W</div>
                                </ApplianceInfo>
                                <ActionButtons>
                                    <EditButton onClick={() => handleStartEdit(appliance)} title="Editar"><Edit size={16}/></EditButton>
                                    <DeleteButton onClick={() => handleDeleteAppliance(appliance.id)} title="Excluir"><Trash2 size={16} /></DeleteButton>
                                </ActionButtons>
                            </ApplianceItem>
                        ))}
                    </ApplianceList>
                </div>
            ))
            ) : (
              <EmptyState>
                <Search size={48} />
                <h3>Nenhum Aparelho Encontrado</h3>
                <p>Tente ajustar sua busca ou filtro.</p>
              </EmptyState>
            )}
        </ListCard>
      </ContentGrid>
        )}

      </TabContent>
    </SettingsWrapper>
  );
};
export default ResidenceSettings;
