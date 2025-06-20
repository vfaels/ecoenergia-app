// src/contexts/authContext.tsx
import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  updateUser: (updatedUserData: User) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserFromStorage() {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          localStorage.clear(); 
        }
      }
      setLoading(false);
    }

    loadUserFromStorage();
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user: loggedUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(loggedUser);
      
      navigate('/app');
    } catch (error) {
      console.error('Falha no login:', error);
      alert('Email ou senha inválidos.');
    }
  };

  const signOut = () => {
    setUser(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    delete api.defaults.headers.common['Authorization'];

    navigate('/login');
  };

  const updateUser = (updatedUserData: User) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      signIn, 
      signOut, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};