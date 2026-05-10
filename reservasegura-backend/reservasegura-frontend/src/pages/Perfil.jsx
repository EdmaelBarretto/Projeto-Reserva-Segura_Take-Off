import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, CreditCard, Landmark, Bell,
  MessageSquare, MapPin, UserCircle, ChevronRight,
  Library, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Perfil = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const iniciais = user?.nome
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'RS';

  const menuItems = [
    { icon: <User size={18} />, label: "Informações Pessoais", path: "/perfil/editar" },
    { icon: <CreditCard size={18} />, label: "Métodos de Pagamento", path: "/perfil/pagamentos" },
    { icon: <Landmark size={18} />, label: "Bancos e Cartões", path: "/perfil/bancos" },
    { icon: <Bell size={18} />, label: "Notificações", path: "/perfil/notificacoes", badge: 2 },
    { icon: <MessageSquare size={18} />, label: "Suporte", path: "/perfil/suporte" },
    { icon: <MapPin size={18} />, label: "Endereço", path: "/perfil/endereco" },
    { icon: <Library size={18} />, label: "Meus Cards", path: "/configuracoes" },
  ];

  const handleLogout = () => {
    logout(); // Limpa localStorage e contexto
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft size={20} className="text-slate-800" />
        </button>
        <h1 className="text-sm font-bold text-slate-800">Usuário</h1>
        <button className="p-2">
          <UserCircle size={24} className="text-slate-800" />
        </button>
      </div>

      <div className="flex items-center gap-4 px-6 py-8">
        <div className="w-16 h-16 rounded-full bg-[#86a687] flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {iniciais}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{user?.nome || 'Usuário'}</h2>
          <p className="text-xs text-gray-400">Nível {Math.floor((user?.xpTotal || 0) / 300) + 1}</p>
        </div>
      </div>

      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="group flex items-center justify-between p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-4 pl-2">
              <span className="text-gray-400 group-hover:text-[#567462] transition-colors">{item.icon}</span>
              <span className="text-[13px] font-medium text-slate-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="bg-[#567462] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-300 mr-2" />
            </div>
          </div>
        ))}

        <div
          onClick={handleLogout}
          className="flex items-center justify-between p-4 mt-4 cursor-pointer hover:bg-red-50 transition-all"
        >
          <div className="flex items-center gap-4 pl-2 text-red-500">
            <LogOut size={18} />
            <span className="text-[13px] font-bold">Sair da conta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
