import { useState, useEffect, useMemo, type JSX } from 'react';
import styled from 'styled-components';
import { Lightbulb, PlusCircle, X, Home, ChefHat, Droplets, Bed, Tv, WashingMachine } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/authContext';

// --- Tipagens ---
interface Tip {
  id: number;
  title: string;
  description: string;
  category: string;
}

// --- Componentes Estilizados ---
const TipsWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h1 { font-size: 2.5rem; font-weight: 800; }
`;

const AddTipButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: ${({ theme }) => theme.primaryHover}; }
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const CategoryButton = styled.button<{ $isActive: boolean }>`
  background-color: ${({ theme, $isActive }) => $isActive ? theme.primary : theme.cardBg};
  color: ${({ theme, $isActive }) => $isActive ? 'white' : theme.textSecondary};
  border: 1px solid ${({ theme, $isActive }) => $isActive ? theme.primary : theme.borderColor};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  &:hover { opacity: 0.8; }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TipCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const TipTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const TipDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
  flex-grow: 1;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem; right: 1rem;
  background: none; border: none;
  color: ${({ theme }) => theme.textSecondary};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label { display: block; font-weight: 500; margin-bottom: 0.5rem; }
  input, textarea, select {
    width: 100%;
    padding: 0.8rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }
  textarea { min-height: 100px; }
`;

// --- Componente ---

const categories = ['Geral', 'Cozinha', 'Quarto', 'Sala', 'Banheiro', 'Lavanderia'];
const categoryIcons: { [key: string]: JSX.Element } = {
  Geral: <Home size={20} />, Cozinha: <ChefHat size={20} />, Quarto: <Bed size={20} />,
  Sala: <Tv size={20} />, Banheiro: <Droplets size={20} />, Lavanderia: <WashingMachine size={20} />
};

const TipsPage = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Geral');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTip, setNewTip] = useState({ title: '', description: '', category: 'Geral' });

  const fetchTips = async () => {
    try {
      const response = await api.get('/tips');
      setTips(response.data);
    } catch (error) {
      console.error("Erro ao buscar dicas:", error);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const filteredTips = useMemo(() => {
    return tips.filter(tip => tip.category === selectedCategory);
  }, [tips, selectedCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTip(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tips', newTip);
      alert('Dica adicionada com sucesso!');
      setIsModalOpen(false);
      setNewTip({ title: '', description: '', category: 'Geral' });
      fetchTips(); 
    } catch (error) {
      console.error("Erro ao adicionar dica:", error);
      alert('Falha ao adicionar a dica.');
    }
  };

  return (
    <TipsWrapper>
      <Header>
        <h1><Lightbulb /> Dicas de Economia</h1>
        {user?.role === 'ADMIN' && (
          <AddTipButton onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} />
            Adicionar Dica
          </AddTipButton>
        )}
      </Header>

      <CategoryFilters>
        {categories.map(category => (
          <CategoryButton 
            key={category} 
            $isActive={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryIcons[category]}
            <span style={{ marginLeft: '0.5rem' }}>{category}</span>
          </CategoryButton>
        ))}
      </CategoryFilters>

      <TipsGrid>
        {filteredTips.map(tip => (
          <TipCard key={tip.id}>
            <TipTitle>{tip.title}</TipTitle>
            <TipDescription>{tip.description}</TipDescription>
          </TipCard>
        ))}
      </TipsGrid>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}><X/></CloseButton>
            <h2>Nova Dica de Economia</h2>
            <form onSubmit={handleAddTip} style={{ marginTop: '1.5rem' }}>
              <FormGroup>
                <label htmlFor="title">Título</label>
                <input type="text" id="title" name="title" value={newTip.title} onChange={handleInputChange} required />
              </FormGroup>
              <FormGroup>
                <label htmlFor="category">Categoria</label>
                <select id="category" name="category" value={newTip.category} onChange={handleInputChange} required>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </FormGroup>
              <FormGroup>
                <label htmlFor="description">Descrição</label>
                <textarea id="description" name="description" value={newTip.description} onChange={handleInputChange} required />
              </FormGroup>
              <AddTipButton type="submit" style={{ width: '100%', justifyContent: 'center' }}>Salvar Dica</AddTipButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </TipsWrapper>
  );
};

export default TipsPage;