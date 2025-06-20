import { ThemeProvider } from 'styled-components';
import { useTheme } from './contexts/themeContext';
import { AppRouter } from './router/AppRouter';
import { GlobalStyle } from './styles/GlobalStyle';
import { lightTheme, darkTheme } from './styles/themes';

function App() {
  const { themeName } = useTheme();

  return (
    <ThemeProvider theme={themeName === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;