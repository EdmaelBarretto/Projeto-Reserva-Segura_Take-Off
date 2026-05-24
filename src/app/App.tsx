import { Home, Trophy, TrendingUp, ShieldCheck, Gift, Target, Store, Flame, BookOpen, Wallet, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Lessons from "./components/Lessons";
import Boxes from "./components/Boxes";
import ProfileScreen from "./components/ProfileScreen";
import AuthScreen from "./components/AuthScreen";
import Leagues from "./components/Leagues";
import Shop from "./components/Shop";
import DesktopLayout from "./components/DesktopLayout";
import { CoinIcon, XPIcon } from "./components/icons/GameIcons";
import { useAuth } from "../context/AuthContext";
import { goalService, missionService } from "../services/api";
import { XP_PER_LEVEL, getCurrentLevel, getXpInLevel, getXpProgressPercent } from "./utils/xp";

type AppTab = "inicio" | "ligas" | "caixinhas" | "licoes" | "loja";

export default function App() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<AppTab>("inicio");
  const [showProfile, setShowProfile] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#618c78]"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={() => {}} />;
  }

  const renderDesktopContent = () => {
    if (currentTab === "licoes") {
      return <Lessons onBack={() => setCurrentTab("inicio")} />;
    }
    if (currentTab === "caixinhas") {
      return <Boxes onBack={() => setCurrentTab("inicio")} />;
    }
    if (currentTab === "ligas") {
      return <Leagues onBack={() => setCurrentTab("inicio")} />;
    }
    if (currentTab === "loja") {
      return <Shop onBack={() => setCurrentTab("inicio")} />;
    }
    return <HomeContent setCurrentTab={setCurrentTab} setShowProfile={setShowProfile} />;
  };

  return (
    <>
      {/* Desktop Version */}
      <DesktopLayout currentTab={currentTab} onTabChange={setCurrentTab}>
        {renderDesktopContent()}
      </DesktopLayout>

      {/* Mobile Version */}
      <div className="md:hidden size-full">
        <MobileApp
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
        />
      </div>
    </>
  );
}

function MobileApp({
  currentTab,
  setCurrentTab,
  showProfile,
  setShowProfile
}: {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}) {
  if (currentTab === "loja") {
    return (
      <MobileScreenShell currentTab={currentTab} setCurrentTab={setCurrentTab} showProfile={showProfile} onCloseProfile={() => setShowProfile(false)}>
        <Shop onBack={() => setCurrentTab("inicio")} />
      </MobileScreenShell>
    );
  }

  if (currentTab === "ligas") {
    return (
      <MobileScreenShell currentTab={currentTab} setCurrentTab={setCurrentTab} showProfile={showProfile} onCloseProfile={() => setShowProfile(false)}>
        <Leagues onBack={() => setCurrentTab("inicio")} />
      </MobileScreenShell>
    );
  }

  if (currentTab === "licoes") {
    return (
      <MobileScreenShell currentTab={currentTab} setCurrentTab={setCurrentTab} showProfile={showProfile} onCloseProfile={() => setShowProfile(false)}>
        <Lessons onBack={() => setCurrentTab("inicio")} />
      </MobileScreenShell>
    );
  }

  if (currentTab === "caixinhas") {
    return (
      <MobileScreenShell currentTab={currentTab} setCurrentTab={setCurrentTab} showProfile={showProfile} onCloseProfile={() => setShowProfile(false)}>
        <Boxes onBack={() => setCurrentTab("inicio")} />
      </MobileScreenShell>
    );
  }

  return (
    <MobileScreenShell currentTab={currentTab} setCurrentTab={setCurrentTab} showProfile={showProfile} onCloseProfile={() => setShowProfile(false)}>
      <HomeContent setCurrentTab={setCurrentTab} setShowProfile={setShowProfile} />
    </MobileScreenShell>
  );
}

function HomeContent({
  setCurrentTab,
  setShowProfile
}: {
  setCurrentTab: (tab: AppTab) => void;
  setShowProfile?: (show: boolean) => void;
}) {
  const { user } = useAuth();
  const [metas, setMetas] = useState<any[]>([]);
  const [carregandoMetas, setCarregandoMetas] = useState(true);
  
  // Novos estados para as Missões
  const [missoes, setMissoes] = useState<any[]>([]);
  const [carregandoMissoes, setCarregandoMissoes] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;

    // Busca as Caixinhas (Metas)
    goalService.listar(user.userId)
      .then(setMetas)
      .catch(console.error)
      .finally(() => setCarregandoMetas(false));

    // Busca as Missões Diárias
    missionService.listarPorUsuario(user.userId)
      .then(setMissoes)
      .catch(console.error)
      .finally(() => setCarregandoMissoes(false));
  }, [user]);

  // Função para escolher o ícone dependendo do 'tipo' que vem do PostgreSQL
  const getIconForType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'deposito': return Wallet;
      case 'educacao': return BookOpen;
      case 'disciplina': return ShieldCheck;
      case 'progresso': return TrendingUp;
      case 'consistencia': return Clock;
      default: return Star;
    }
  };

  const nomeCompleto = user?.nome || 'Usuário';
  const primeiroNome = nomeCompleto.split(' ')[0];
  
  const iniciais = nomeCompleto
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const xpTotal = user?.xpTotal || 0;
  const xpProximoNivel = XP_PER_LEVEL;
  const nivelAtual = getCurrentLevel(xpTotal);
  const xpNoNivel = getXpInLevel(xpTotal);
  const porcentagemXP = getXpProgressPercent(xpTotal);

  const moedas = user?.pontosPremio || 0;

  return (
    <div className="size-full bg-gray-50 overflow-auto">
      {/* Mobile Status Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white">
        <p className="text-sm font-semibold text-[#1e2939]">9:41</p>
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 border-[1.25px] border-[#1e2939] rounded-md relative">
            <div className="absolute inset-[3px] bg-[#1e2939] rounded-sm" />
          </div>
        </div>
      </div>

      {/* Header Mobile */}
      <div className="md:hidden bg-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowProfile?.(true)} className="relative hover:opacity-80 transition-opacity">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-normal border-[2.5px] border-white shadow-lg" style={{ backgroundImage: "linear-gradient(135deg, rgb(136, 169, 131) 50%, rgb(63, 168, 162) 100%)" }}>
              {iniciais}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#618c78] rounded-full flex items-center justify-center text-white text-xs font-bold border-[1.25px] border-white">
              {nivelAtual}
            </div>
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#101828]">{nomeCompleto}</h1>
            <p className="text-xs text-[#6a7282]">Aspirante Nível {nivelAtual}</p>
          </div>
        </div>
        <div className="bg-[#618c78] rounded-full px-3 py-2 flex items-center gap-2">
          <CoinIcon size={20} className="filter brightness-0 invert" />
          <span className="text-base font-bold text-white">{moedas}</span>
        </div>
      </div>

      {/* XP Progress Mobile */}
      <div className="md:hidden bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <XPIcon size={18} />
            <span className="text-sm font-semibold text-[#4a5565]">{xpNoNivel} / {xpProximoNivel} XP</span>
          </div>
          <span className="text-sm font-bold text-[#618c78]">{Math.floor(porcentagemXP)}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#e5e7eb] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#86a783] to-[#5bb49b] rounded-full transition-all duration-1000" style={{ width: `${porcentagemXP}%` }} />
        </div>
      </div>

      {/* Main Container Content */}
      <div className="md:p-8">

        {/* Achievement Cards (Apenas Desktop) */}
        <div className="px-4 md:px-0 py-4 flex gap-3">
          <div className="flex-1 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 md:hidden" style={{ backgroundImage: "linear-gradient(170deg, rgb(97, 140, 120) 8.5%, rgb(123, 241, 168) 91.5%)" }}>
            <Flame className="w-8 h-8 text-white" strokeWidth={2} />
            <div className="text-center">
              <p className="text-xs text-white opacity-85">Sequência</p>
              <p className="text-base font-bold text-white">1 dia</p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 md:hidden" style={{ backgroundImage: "linear-gradient(170deg, rgb(218, 165, 32) 0%, rgb(255, 215, 0) 100%)" }}>
            <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
            <div className="text-center">
              <p className="text-xs text-white opacity-85">XP Total</p>
              <p className="text-base font-bold text-white">{xpTotal}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Boxes (Caixinhas Dinâmicas) */}
        <div className="px-4 md:px-0 py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-[#101828]">Principais Caixinhas</h2>
            <button onClick={() => setCurrentTab("caixinhas")} className="text-sm font-semibold text-[#618c78]">Ver todas</button>
          </div>

          {carregandoMetas ? (
            <div className="text-center py-6 text-sm text-gray-400">A carregar os seus objetivos...</div>
          ) : metas.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-400 font-medium">Não foram encontradas caixinhas ativas.</p>
              <button onClick={() => setCurrentTab("caixinhas")} className="mt-2 text-xs font-bold text-[#618c78] hover:underline">
                + Criar o meu primeiro cofrinho
              </button>
            </div>
          ) : (
            <Slider dots={true} infinite={metas.length > 1} speed={500} slidesToShow={1} slidesToScroll={1} arrows={false} className="boxes-carousel">
              {metas.map((meta) => {
                const alvo = meta.valorAlvo || 0;
                const atual = meta.valorAtual || 0;
                const percentagem = alvo > 0 ? Math.round((atual / alvo) * 100) : 0;

                return (
                  <div key={meta.id} className="px-1">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #5bb49b 0%, #3fa8a2 100%)" }}>
                          <span className="text-xl">💰</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#101828] mb-1">{meta.nome}</h3>
                          <p className="text-sm text-[#6a7282] mb-2">Meta: R$ {alvo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xl font-bold text-[#101828]">R$ {atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <span className="text-sm font-bold text-[#618c78]">{percentagem}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#5bb49b] to-[#3fa8a2] rounded-full" style={{ width: `${Math.min(percentagem, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
  <div className="flex items-center gap-2">
    <span className="text-xs text-[#618c78]">
      💰 Rendeu R$ {(atual * 0.06).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  </div>
  <button onClick={() => setCurrentTab("caixinhas")} className="text-xs font-semibold text-[#618c78]">Ver detalhes →</button>
</div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>

        {/* Missions Section Dinâmica */}
        <div className="px-4 md:px-0 py-4 mb-20 md:mb-0">
          <h2 className="text-xl font-bold text-[#101828] mb-3">Missões Diárias</h2>
          <div className="space-y-3">
            {carregandoMissoes ? (
               <div className="text-center py-4 text-sm text-gray-400">A carregar missões...</div>
            ) : missoes.length === 0 ? (
               <div className="text-center py-4 text-sm text-gray-400">Nenhuma missão em andamento.</div>
            ) : (
               missoes.map((missao, index) => (
                 <MissionCard
                   key={index}
                   icon={getIconForType(missao.type)}
                   title={missao.title}
                   progress={missao.progress}
                   total={missao.total}
                   reward={missao.reward}
                   completed={missao.completed}
                 />
               ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full z-50">
        <div className="flex items-center justify-around py-2">
          <NavButton icon={<Home />} label="Início" active onClick={() => setCurrentTab("inicio")} />
          <NavButton icon={<Trophy />} label="Ligas" active={false} onClick={() => setCurrentTab("ligas")} />
          <NavButton icon={<Store />} label="Caixinhas" active={false} onClick={() => setCurrentTab("caixinhas")} />
          <NavButton icon={<Target />} label="Lições" active={false} onClick={() => setCurrentTab("licoes")} />
          <NavButton icon={<Gift />} label="Loja" active={false} onClick={() => setCurrentTab("loja")} />
        </div>
      </div>
    </div>
  );
}

function MobileScreenShell({
  currentTab,
  setCurrentTab,
  showProfile,
  onCloseProfile,
  children
}: {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  showProfile: boolean;
  onCloseProfile: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="size-full bg-white overflow-hidden flex flex-col h-screen relative">
      {showProfile && <ProfileScreen onClose={onCloseProfile} />}
      <div className="flex-1 overflow-auto pb-[60px]">{children}</div>
      <div className="absolute bottom-0 w-full">
        <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>
    </div>
  );
}

function MissionCard({
  icon: Icon,
  title,
  progress,
  total,
  reward,
  completed = false
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  progress: number;
  total: number;
  reward: number;
  completed?: boolean;
}) {
  const percentage = (progress / total) * 100;

  return (
    <div className={`bg-white rounded-2xl p-4 border ${completed ? "border-[#618c78]" : "border-gray-200"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#618c78]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#618c78]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[#101828]">{title}</h3>
          <p className="text-xs text-[#6a7282]">
            {completed ? "Completa!" : `${progress}/${total} concluído`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <CoinIcon size={16} />
          <span className="text-sm font-bold text-[#f59e0b]">{reward}</span>
        </div>
      </div>
      {!completed && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#618c78] rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
      )}
      {completed && (
        <div className="w-full bg-[#618c78]/10 text-[#618c78] text-center py-2 rounded-xl text-sm font-bold">
          ✓ Missão Completa
        </div>
      )}
    </div>
  );
}

function BottomNav({
  currentTab,
  setCurrentTab
}: {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
}) {
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        <NavButton icon={<Home />} label="Início" active={currentTab === "inicio"} onClick={() => setCurrentTab("inicio")} />
        <NavButton icon={<Trophy />} label="Ligas" active={currentTab === "ligas"} onClick={() => setCurrentTab("ligas")} />
        <NavButton icon={<Store />} label="Caixinhas" active={currentTab === "caixinhas"} onClick={() => setCurrentTab("caixinhas")} />
        <NavButton icon={<Target />} label="Lições" active={currentTab === "licoes"} onClick={() => setCurrentTab("licoes")} />
        <NavButton icon={<Gift />} label="Loja" active={currentTab === "loja"} onClick={() => setCurrentTab("loja")} />
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[60px] py-1">
      <div className={active ? "text-[#618c78]" : "text-[#9ca3af]"}>{icon}</div>
      <span className={`text-xs ${active ? "text-[#618c78] font-semibold" : "text-[#9ca3af]"}`}>{label}</span>
    </button>
  );
}