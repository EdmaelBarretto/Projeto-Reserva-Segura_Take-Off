import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalCard from '../components/GoalCard';
import MissionItemWeb from '../components/MissionItemWeb';
import { Zap, Trophy, Flame, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { goalService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [metas, setMetas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Pega as iniciais do nome para o avatar
  const iniciais = user?.nome
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'RS';

  // Busca as metas do usuário logado ao carregar
  useEffect(() => {
    if (!user?.userId) return;

    goalService.listar(user.userId)
      .then(setMetas)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [user]);

  const StatRow = ({ label, value, color = "text-[#1a2b3c]" }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
      <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
  );

  // Calcula total poupado somando todas as metas
  const totalPoupado = metas.reduce((acc, m) => acc + (m.valorAtual || 0), 0);

  return (
    <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 p-4 md:p-8">

      {/* --- BARRA LATERAL (DESKTOP) --- */}
      <aside className="hidden md:block md:col-span-3">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col space-y-8 sticky top-28">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative mb-4 cursor-pointer group" onClick={() => navigate('/perfil')}>
              <div className="w-20 h-20 bg-[#86a687] rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-white">
                {iniciais}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#567462] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white font-black">
                {Math.floor((user?.xpTotal || 0) / 300) + 1}
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-black text-[#1a2b3c]">{user?.nome || 'Usuário'}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Nível {Math.floor((user?.xpTotal || 0) / 300) + 1}
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center mb-1.5 px-1 text-[10px] font-black uppercase">
              <span className="text-gray-500">{user?.xpTotal || 0} XP</span>
              <span className="text-[#86a687]">Acumulado</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
              <div className="bg-[#639d84] h-full" style={{ width: `${Math.min(((user?.xpTotal || 0) % 300) / 300 * 100, 100)}%` }}></div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Estatísticas</p>
            <div className="bg-gradient-to-b from-[#639d84] to-[#7ed4a3] p-5 rounded-[24px] text-white shadow-md">
              <Flame size={20} fill="white" className="mb-4" />
              <p className="text-[10px] font-bold opacity-80 uppercase leading-none">Metas ativas</p>
              <p className="text-2xl font-black italic">{metas.length}</p>
            </div>
            <div className="bg-gradient-to-b from-[#c28e2e] to-[#f5d061] p-5 rounded-[24px] text-white shadow-md">
              <Trophy size={20} fill="white" className="mb-4" />
              <p className="text-[10px] font-bold opacity-80 uppercase leading-none">XP Total</p>
              <p className="text-2xl font-black italic">{user?.xpTotal || 0}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50">
            <h4 className="font-black text-[#1a2b3c] mb-4 px-2">Resumo</h4>
            <StatRow label="Total poupado" value={`R$ ${totalPoupado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
            <StatRow label="Metas criadas" value={metas.length} color="text-[#639d84]" />
            <StatRow label="XP acumulado" value={user?.xpTotal || 0} color="text-orange-500" />
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO CENTRAL --- */}
      <main className="col-span-1 md:col-span-9 space-y-10">

        {/* Header Mobile */}
        <div className="md:hidden bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer" onClick={() => navigate('/perfil')}>
                <div className="w-14 h-14 bg-[#86a687] rounded-full flex items-center justify-center text-lg font-bold text-white border-2 border-white shadow-md">
                  {iniciais}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-black text-[#1a2b3c]">{user?.nome || 'Usuário'}</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Nível {Math.floor((user?.xpTotal || 0) / 300) + 1}
                </p>
              </div>
            </div>
            <div className="bg-[#567462] text-white px-4 py-2 rounded-full flex items-center gap-2 font-black text-xs shadow-md">
              <Zap size={14} fill="currentColor" /> {user?.xpTotal || 0} XP
            </div>
          </div>
        </div>

        {/* Saudação Desktop */}
        <div className="hidden md:block bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-[#1a2b3c]">Bom dia, {user?.nome?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 font-medium text-lg mt-1">
            Você tem <span className="text-[#86a687] font-bold">{metas.length} caixinha{metas.length !== 1 ? 's' : ''}</span> ativa{metas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Metas do usuário */}
        <section>
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xl font-black text-[#1a2b3c]">Suas Caixinhas</h3>
          </div>

          {carregando ? (
            <p className="text-gray-400 text-sm px-1">Carregando...</p>
          ) : metas.length === 0 ? (
            <div className="bg-white rounded-[32px] p-8 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-medium">Você ainda não tem caixinhas.</p>
              <p className="text-[#567462] font-bold text-sm mt-1">Crie sua primeira meta abaixo!</p>
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar">
              {metas.map((meta) => {
                const pct = meta.valorAlvo > 0
                  ? Math.round((meta.valorAtual / meta.valorAlvo) * 100)
                  : 0;
                return (
                  <GoalCard
                    key={meta.id}
                    title={meta.nome}
                    icon="💰"
                    saved={meta.valorAtual}
                    target={meta.valorAlvo}
                    percentage={pct}
                    stars={Math.min(Math.ceil(pct / 20), 5)}
                    xpBonus={Math.floor(meta.valorAlvo / 100) * 10}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Missões fixas por enquanto */}
        <section className="bg-transparent md:bg-white p-0 md:p-8 rounded-[32px] space-y-6">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Target className="md:hidden text-[#a855f7]" size={22} strokeWidth={2.5} />
              <h3 className="font-black text-xl md:text-2xl text-[#1a2b3c]">Missões Diárias</h3>
            </div>
          </div>
          <div className="space-y-4">
            <MissionItemWeb title="Depósito R$ 50" subtitle="Adicione em qualquer caixinha" xp={80} coins={50} isCompleted={false} />
            <MissionItemWeb title="Streak ativo!" subtitle="Faça login e poupe hoje" xp={50} coins={30} isCompleted={true} />
            <MissionItemWeb title="Convide amigos" subtitle="Ganhe bônus por indicação" xp={120} coins={100} isCompleted={false} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
