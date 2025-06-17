// src/styled.d.ts
import 'styled-components';
import { lightTheme } from './styles/themes';

// Pega o tipo do nosso lightTheme (poderia ser o darkTheme também, pois ambos têm a mesma estrutura)
type Theme = typeof lightTheme;

declare module 'styled-components' {
  // Sobrescreve o DefaultTheme com a estrutura do nosso tema
  export interface DefaultTheme extends Theme {}
}