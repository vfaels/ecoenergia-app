import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.body};
`;

const MainContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; 
`;

const Content = styled.main`
  flex: 1;
  padding: 2.5rem;
`;

export const MainLayout = () => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContentWrapper>
        <Topbar />
        <Content>
          <Outlet /> 
        </Content>
      </MainContentWrapper>
    </LayoutContainer>
  );
};