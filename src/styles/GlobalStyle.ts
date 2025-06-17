// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Reset Básico */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.body}; /* Usa a cor do body do tema ativo */
    color: ${({ theme }) => theme.text}; /* Usa a cor de texto do tema ativo */
    font-family: 'Poppins', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Outros estilos globais que você queira adicionar */
`;