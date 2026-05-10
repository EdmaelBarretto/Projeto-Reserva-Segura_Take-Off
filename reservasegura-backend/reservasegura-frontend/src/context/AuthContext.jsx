import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria o "contexto" — uma forma de compartilhar dados entre todos os componentes
const AuthContext = createContext(null);

// Provider: envolve o app inteiro e disponibiliza o usuário para todos
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { token, userId, nome }
  const [loading, setLoading] = useState(true);

  // Ao carregar o app, verifica se já tem sessão salva
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const nome = localStorage.getItem("nome");

    if (token && userId) {
      setUser({ token, userId, nome });
    }
    setLoading(false);
  }, []);

  // Salva o usuário após login/cadastro
  const login = (dados) => {
    localStorage.setItem("token", dados.token);
    localStorage.setItem("userId", dados.userId);
    localStorage.setItem("nome", dados.nome);
    setUser(dados);
  };

  // Remove tudo ao fazer logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("nome");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto facilmente
// Uso: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
