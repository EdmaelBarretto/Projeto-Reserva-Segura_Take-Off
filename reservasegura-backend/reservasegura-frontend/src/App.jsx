import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonList from './pages/LessonList';
import LessonDetail from './pages/LessonDetail';
import Avaliacao from './pages/Avaliacao';
import Perfil from './pages/Perfil';
import EditarPerfil from './pages/EditarPerfil';
import Configuracoes from './pages/Configuracoes';
import Ranking from './pages/Ranking';

// Protege rotas: se não estiver logado, manda pro login
function RotaPrivada({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Carregando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas privadas — precisam de login */}
        <Route path="/dashboard" element={<RotaPrivada><Layout><Dashboard /></Layout></RotaPrivada>} />
        <Route path="/ranking" element={<RotaPrivada><Layout><Ranking /></Layout></RotaPrivada>} />
        <Route path="/licoes" element={<RotaPrivada><Layout><Lessons /></Layout></RotaPrivada>} />
        <Route path="/lista-licoes" element={<RotaPrivada><Layout><LessonList /></Layout></RotaPrivada>} />
        <Route path="/detalhe-licao" element={<RotaPrivada><Layout><LessonDetail /></Layout></RotaPrivada>} />
        <Route path="/perfil" element={<RotaPrivada><Perfil /></RotaPrivada>} />
        <Route path="/perfil/editar" element={<RotaPrivada><EditarPerfil /></RotaPrivada>} />
        <Route path="/configuracoes" element={<RotaPrivada><Configuracoes /></RotaPrivada>} />
        <Route path="/avaliacao" element={<RotaPrivada><Avaliacao /></RotaPrivada>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
