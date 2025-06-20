import styled, { keyframes } from 'styled-components';
import { Monitor, BarChart, Bot, Lightbulb } from 'lucide-react';
import { PublicHeader } from '../components/common/PublicHeader';
import { Link } from 'react-router-dom';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Componentes Estilizados ---
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Section = styled.section`
  padding: 6rem 5%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  @media(max-width: 768px) { padding: 4rem 5%; }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 600px;
  margin: 0 auto 4rem auto;
`;

const HeroSection = styled(Section)`
  padding-top: 12rem; /* Aumentado para compensar a falta da imagem */
  padding-bottom: 8rem;
  min-height: 80vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.8s ease-out;
  color: ${({ theme }) => theme.text};
  span { color: ${({ theme }) => theme.primary}; }
  @media(max-width: 768px) { font-size: 2.5rem; }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 650px;
  margin-bottom: 2.5rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const CtaButton = styled(Link)`
  padding: 1rem 2.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  background: ${({ theme }) => `linear-gradient(45deg, ${theme.primary}, ${theme.primaryHover})`};
  color: white;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1.2s ease-out;
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px ${({ theme }) => `${theme.primary}40`};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: 2rem;
  text-align: left;
  
  /* Padrão de 1 coluna para mobile */
  grid-template-columns: 1fr;

  /* 2 colunas para tablets e desktops */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px ${({ theme }) => theme.shadowColor};
  }
`;

const FeatureIcon = styled.div`
  display: inline-flex;
  padding: 0.8rem;
  border-radius: 10px;
  background-color: ${({ theme }) => `${theme.primary}20`};
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const FeatureText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
`;

const HowItWorksContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  margin-top: 4rem;
  
  @media(max-width: 768px) {
    flex-direction: column;
  }
`;

const StepCard = styled.div`
  flex: 1;
`;

const StepNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const CtaSection = styled(Section)`
  background-color: ${({ theme }) => theme.bodySecondary};
  border-radius: 20px;
  margin: 4rem auto;
  transition: background-color 0.3s ease;
`;

const Footer = styled.footer`
  padding: 3rem 5%;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  transition: border-top-color 0.3s ease;
`;

const LandingPage = () => {
  const features = [
    { icon: <Monitor size={28}/>, title: "Monitore em Tempo Real", text: "Acompanhe seu consumo de energia e custos com precisão, diretamente no seu painel de controle." },
    { icon: <BarChart size={28}/>, title: "Histórico Detalhado", text: "Analise seu uso de energia ao longo do tempo para identificar padrões e oportunidades de economia." },
    { icon: <Bot size={28}/>, title: "Simulador Inteligente", text: "Planeje seus gastos simulando o consumo de novos eletrodomésticos antes mesmo de comprá-los." },
    { icon: <Lightbulb size={28}/>, title: "Dicas Personalizadas", text: "Receba dicas de economia de energia que realmente funcionam, baseadas no seu perfil de consumo." },
  ];
  
  return (
    <PageWrapper>
      <PublicHeader />
      
      <main>
        <HeroSection>
          <HeroTitle>
            A energia que você controla, <span>o dinheiro que você economiza.</span>
          </HeroTitle>
          <HeroSubtitle>
            EcoEnergia é a plataforma definitiva para entender sua conta de luz, reduzir seu consumo e ajudar o planeta. Tome as rédeas da sua energia hoje.
          </HeroSubtitle>
          <CtaButton to="/cadastro">Comece a Economizar Agora</CtaButton>
        </HeroSection>
        
        <Section id="features">
          <SectionTitle>Tudo o que você precisa para uma vida mais sustentável</SectionTitle>
          <SectionSubtitle>Nossa plataforma foi desenhada para ser simples, intuitiva e poderosa.</SectionSubtitle>
          <FeaturesGrid>
            {features.map(feature => (
              <FeatureCard key={feature.title}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureText>{feature.text}</FeatureText>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Section>
        
        <Section id="how-it-works">
          <SectionTitle>Comece em apenas 3 passos</SectionTitle>
          <HowItWorksContainer>
            <StepCard>
              <StepNumber>1</StepNumber>
              <FeatureTitle>Cadastre-se</FeatureTitle>
              <FeatureText>Crie sua conta gratuita em menos de um minuto.</FeatureText>
            </StepCard>
            <StepCard>
              <StepNumber>2</StepNumber>
              <FeatureTitle>Configure sua Residência</FeatureTitle>
              <FeatureText>Adicione informações básicas e seus eletrodomésticos.</FeatureText>
            </StepCard>
            <StepCard>
              <StepNumber>3</StepNumber>
              <FeatureTitle>Economize!</FeatureTitle>
              <FeatureText>Comece a monitorar, simular e receber dicas para reduzir sua conta.</FeatureText>
            </StepCard>
          </HowItWorksContainer>
        </Section>
        
        <CtaSection id="cta">
          <SectionTitle>Pronto para transformar sua relação com a energia?</SectionTitle>
          <CtaButton to="/cadastro">Quero Fazer Parte</CtaButton>
        </CtaSection>
      </main>
      
      <Footer>
        <p>&copy; {new Date().getFullYear()} EcoEnergia. Todos os direitos reservados.</p>
      </Footer>
    </PageWrapper>
  );
};

export default LandingPage;