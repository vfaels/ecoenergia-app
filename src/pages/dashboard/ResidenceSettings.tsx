// src/pages/dashboard/ResidenceSettings.tsx
import { useEffect } from 'react';
import styled from 'styled-components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Toaster, toast } from 'react-hot-toast';
import { Home, Users, CheckCircle, Pencil, Building, DollarSign } from 'lucide-react';
import api from '../../services/api';

// --- Esquema de Validação com Zod ---
const settingsSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  type: z.enum(['Casa', 'Apartamento'], { required_error: 'Selecione um tipo de residência.' }),
  residents: z.number().min(1, 'Deve haver pelo menos 1 morador.').positive(),
  rooms: z.number().min(1, 'Deve haver pelo menos 1 cômodo.').positive(),
  kwh_cost: z.number().positive('O custo deve ser um número positivo.'),
});

// Tipagem inferida do esquema Zod
type SettingsFormData = z.infer<typeof settingsSchema>;

// --- COMPONENTES ESTILIZADOS ---

const SettingsWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; 
  gap: 2.5rem;
  align-items: flex-start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FormContainer = styled.div``;

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

const FormCard = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2rem;
`;

const InfoPanel = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2rem;
  position: sticky; /* Painel fica fixo ao rolar a página */
  top: 90px;

  img {
    width: 100%;
    max-width: 200px;
    display: block;
    margin: 0 auto 1.5rem auto;
  }

  h4 {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.text};
    margin-bottom: 1rem;
    text-align: center;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
    line-height: 1.5;

    svg {
      color: ${({ theme }) => theme.primary};
      width: 18px;
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.75rem;

    svg {
      color: ${({ theme }) => theme.primary};
    }
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
  transition: border-color 0.2s, box-shadow 0.2s;

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
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.textSecondary};
    cursor: not-allowed;
  }
`;


// --- COMPONENTE PRINCIPAL APRIMORADO ---

export const ResidenceSettings = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/residence_config');
        const data = response.data;
        // Popula todos os campos do formulário com os dados da API
        setValue('name', data.name);
        setValue('type', data.type);
        setValue('residents', data.residents);
        setValue('rooms', data.rooms);
        setValue('kwh_cost', data.kwh_cost);
      } catch (error) {
        console.error("Falha ao buscar configurações da residência:", error);
      }
    };
    fetchSettings();
  }, [setValue]);

  const onSubmit: SubmitHandler<SettingsFormData> = async (data) => {
    try {
      await api.patch('/residence_config', data);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar as configurações.');
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <SettingsWrapper>
        <FormContainer>
          <Header>
            <h1>Configurar Residência</h1>
            <p>Ajuste as informações da sua casa para obter análises mais precisas.</p>
          </Header>

          <FormCard onSubmit={handleSubmit(onSubmit)}>
            {/* Campo Nome da Residência */}
            <InputGroup>
              <label htmlFor="name"><Pencil />Nome da Residência</label>
              <Input id="name" type="text" placeholder="Ex: Minha Casa" {...register('name')} />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </InputGroup>

            {/* Campo Tipo de Residência */}
            <InputGroup>
              <label htmlFor="type"><Building />Tipo de Residência</label>
              <Select id="type" {...register('type')}>
                <option value="">Selecione...</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
              </Select>
              {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
            </InputGroup>
            
            {/* Campo Número de Moradores */}
            <InputGroup>
              <label htmlFor="residents"><Users />Número de Moradores</label>
              <Input id="residents" type="number" {...register('residents', { valueAsNumber: true })} />
              {errors.residents && <ErrorMessage>{errors.residents.message}</ErrorMessage>}
            </InputGroup>

            {/* Campo Número de Cômodos */}
            <InputGroup>
              <label htmlFor="rooms"><Home />Número de Cômodos</label>
              <Input id="rooms" type="number" {...register('rooms', { valueAsNumber: true })} />
              {errors.rooms && <ErrorMessage>{errors.rooms.message}</ErrorMessage>}
            </InputGroup>

            {/* Campo Custo por kWh */}
            <InputGroup>
              <label htmlFor="kwh_cost"><DollarSign />Custo por kWh (R$)</label>
              <Input id="kwh_cost" type="number" step="0.01" placeholder="Ex: 0.75" {...register('kwh_cost', { valueAsNumber: true })} />
              {errors.kwh_cost && <ErrorMessage>{errors.kwh_cost.message}</ErrorMessage>}
            </InputGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </SubmitButton>
          </FormCard>
        </FormContainer>

        <InfoPanel>
          {/* <img src={illustration} alt="Ilustração de uma casa com painéis solares" /> */}
          <h4>Por que esses dados são importantes?</h4>
          <ul>
            <li>
              <CheckCircle />
              <span><strong>Dicas Personalizadas:</strong> O número de moradores e o tipo de residência nos ajudam a oferecer dicas mais relevantes.</span>
            </li>
            <li>
              <CheckCircle />
              <span><strong>Simulações Precisas:</strong> O custo do kWh é essencial para simular seus gastos em Reais (R$) com exatidão.</span>
            </li>
            <li>
              <CheckCircle />
              <span><strong>Metas Realistas:</strong> Usamos essas informações para te ajudar a definir metas de consumo alcançáveis para sua realidade.</span>
            </li>
          </ul>
        </InfoPanel>
      </SettingsWrapper>
    </>
  );
};