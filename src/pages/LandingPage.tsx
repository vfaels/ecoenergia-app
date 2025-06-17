// src/pages/LandingPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { BarChart3, Bot, Lightbulb, ArrowRight, History, Settings } from 'lucide-react';
import { PublicHeader } from '../components/common/PublicHeader';
import { useAuth } from '../contexts/authContext';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- COMPONENTES ESTILIZADOS ---

const PageWrapper = styled.div`
  font-family: 'Poppins', sans-serif;
  background-color: ${({ theme }) => theme.body}; 
  color: ${({ theme }) => theme.text}; 
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  padding-top: 10rem;
  background: ${({ theme }) => theme.theme === 'light' 
    ? 'linear-gradient(135deg, #d8f3dc, #b7e4c7, #95d5b2)' 
    : 'linear-gradient(135deg, #1b4332, #2d6a4f, #40916c)'};
  background-size: 200% 200%;
  animation: ${gradientAnimation} 15s ease infinite;
  transition: background 0.3s ease;

  h2 {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.2;
    color: ${({ theme }) => theme.theme === 'light' ? '#1b4332' : '#FFFFFF'};
    max-width: 800px;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    max-width: 600px;
    /* A cor do parágrafo se adapta ao tema */
    color: ${({ theme }) => theme.theme === 'light' ? '#2d6a4f' : '#E0E0E0'};
    margin-bottom: 2.5rem;
  }
`;

const PrimaryCallToAction = styled(Link)`
  background-color: ${({ theme }) => theme.primary}; 
  color: #FFFFFF; 
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover}; 
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  padding: 6rem 5%;
  text-align: center;
  position: relative;
  background-color: ${({ theme, color }) => color || theme.body}; 
  transition: background-color 0.3s ease;

  h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
    margin-bottom: 1rem;
  }

  p.section-description {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.textSecondary}; 
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto 4rem auto;
  }
`;

const ShapeDivider = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);

  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 110px;
  }

  .shape-fill {
    fill: ${({ color }) => color}; 
    transition: fill 0.3s ease;
  }
`;

const FeatureList = styled.div`
display: flex;
flex-direction: column;
gap: 2rem;
align-items: center;
margin: 0 auto 2rem auto;
width: 100%;
max-width: 900px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  justify-content: center;
  margin: 0 auto 2.5rem auto;
  max-width: 700px;
  padding: 1.5rem;
  

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.primary};
    transition: color 0.3s ease;
  }

  .text-content {
    text-align: left;

    h4 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
      color: ${({ theme }) => theme.theme === 'light' ? '#1b4332' : '#fff'};
    }

    p {
      font-size: 1rem;
      color: ${({ theme }) => theme.textSecondary};
      margin: 0;
    }
  }
`;

const Footer = styled.footer`
  padding: 3rem 5%;
  text-align: center;
  background-color: ${({ theme }) => theme.primaryHover}; 
  color: rgba(255, 255, 255, 0.8);
  transition: background-color 0.3s ease;

  p {
    margin: 0;
  }
`;

// --- COMPONENTE PRINCIPAL ---

export const LandingPage = () => {
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageWrapper>
      <PublicHeader />

      <main>
        <HeroSection>
          <h2>Monitore, economize e contribua para um futuro mais verde.</h2>
          <p>EcoEnergia te ajuda a entender e otimizar seu consumo de energia, promovendo a sustentabilidade no seu dia a dia.</p>
          <PrimaryCallToAction to="/login">
            Comece agora
            <ArrowRight size={20} />
          </PrimaryCallToAction>
        </HeroSection>

        <Section id="dashboard">
          <h3>Acompanhe seu Consumo em Tempo Real</h3>
          <p className="section-description">Visualize de forma clara e intuitiva seus gastos diários, semanais e mensais. Identifique padrões de consumo e saiba exatamente onde você pode economizar.</p>
          <FeatureList>
            <FeatureItem>
              <BarChart3 size={80}/>
              <div className="text-content">
                <h4>Gráficos Detalhados</h4>
                <p>Explore gráficos interativos que facilitam a compreensão do seu uso de energia, com metas de consumo e comparativos.</p>
              </div>
            </FeatureItem>
          </FeatureList>
          <ShapeDivider color={({ theme }) => theme.bodySecondary}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
          </ShapeDivider>
        </Section>

        <Section id="simulator" color={({ theme }) => theme.bodySecondary}>
          <h3>Planeje e Simule sua Economia</h3>
          <p className="section-description">Com o nosso simulador, você pode estimar o impacto de novos aparelhos ou mudanças de hábitos no seu consumo de energia antes de implementá-los. Planeje suas compras de forma consciente e veja o potencial de economia.</p>
          <FeatureList>
             <FeatureItem>
              <Bot size={80}/>
              <div className="text-content">
                <h4>Cálculos Personalizados</h4>
                <p>Simule o consumo de diferentes eletrodomésticos e compare cenários para tomar decisões mais inteligentes e econômicas.</p>
              </div>
            </FeatureItem>
          </FeatureList>
          <ShapeDivider color={({ theme }) => theme.body}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
          </ShapeDivider>
        </Section>

        <Section id="history">
          <h3>Analise seu Histórico de Consumo</h3>
          <p className="section-description">Acesse um histórico completo do seu consumo de energia ao longo do tempo. Compare seus gastos entre diferentes períodos e identifique as épocas do ano com maior consumo para otimizar suas estratégias de economia.</p>
          <FeatureList>
            <FeatureItem>
              <History size={80}/>
              <div className="text-content">
                <h4>Dados Organizados</h4>
                <p>Fácil acesso a todo o seu histórico de consumo em um só lugar, com filtros por dia, mês e ano.</p>
              </div>
            </FeatureItem>
          </FeatureList>
          <ShapeDivider color={({ theme }) => theme.bodySecondary}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
          </ShapeDivider>
        </Section>

        <Section id="tips" color={({ theme }) => theme.bodySecondary}>
          <h3>Receba Dicas e Conteúdo Exclusivo</h3>
          <p className="section-description">Nossa seção de dicas está repleta de informações valiosas sobre como economizar energia, escolher eletrodomésticos eficientes e adotar práticas sustentáveis. Aprenda e aplique no seu dia a dia.</p>
          <FeatureList>
            <FeatureItem>
              <Lightbulb size={80}/>
              <div className="text-content">
                <h4>Artigos e Guias</h4>
                <p>Explore nosso conteúdo educativo com dicas práticas e informações relevantes para um consumo mais consciente.</p>
              </div>
            </FeatureItem>
          </FeatureList>
          <ShapeDivider color={({ theme }) => theme.body}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
          </ShapeDivider>
        </Section>

        <Section id="settings">
          <h3>Configure sua Residência</h3>
          <p className="section-description">Personalize o sistema com as informações da sua casa, como o número de cômodos e moradores. Esses dados nos ajudam a fornecer análises mais precisas e dicas ainda mais relevantes para você.</p>
          <FeatureList>
            <FeatureItem>
              <Settings size={80}/>
              <div className="text-content">
                <h4>Personalização Detalhada</h4>
                <p>Informe as características da sua residência para uma experiência otimizada e cálculos de consumo mais precisos.</p>
              </div>
            </FeatureItem>
          </FeatureList>
        </Section>
      </main>

      <Footer>
        <p>© 2025 EcoEnergia. Conectando você a um consumo consciente e sustentável.</p>
      </Footer>
    </PageWrapper>
  );
};