// src/contexts/authContext.tsx
import { createContext, useState, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipagem para os dados do usuário (pode expandir depois)
interface User {
  name: string;
  email: string;
}

// Tipagem para o valor do contexto
interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Cria o Contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Cria o Provedor do Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // A maneira mais simples de verificar a autenticação é ver se existe um usuário
  const isAuthenticated = !!user;

  const login = (userData: User) => {
    // Em um app real, você receberia dados da API e um token aqui
    setUser(userData);
    // Redireciona para o dashboard após o login
    navigate('/app');
  };

  const logout = () => {
    setUser(null);
    // Redireciona para a página de login após o logout
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
