// src/components/layout/MainLayout.tsx
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

// --- STYLED COMPONENTS (sem alterações aqui) ---
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.bodySecondary};
`;

const ContentContainer = styled.main`
  flex-grow: 1;
  padding: 2.5rem;
`;


// --- COMPONENTE CORRIGIDO ---

export const MainLayout = () => {
  return (
    <AppContainer>
      <Sidebar />
      <MainContentWrapper>
        <Topbar />
        <ContentContainer>
          <Outlet/>
        </ContentContainer>
      </MainContentWrapper>
    </AppContainer>
  );
};