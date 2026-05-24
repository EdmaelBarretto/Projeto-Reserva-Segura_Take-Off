import { ArrowLeft, HelpCircle, Wallet, Target, BarChart3, Settings, Plane, Home, GraduationCap, Heart, ShoppingBag, Shield, Laptop, Bell, TrendingUp, Download, Lock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import BoxDetail from "./BoxDetail";
import { useAuth } from "../../context/AuthContext";
import { goalService, statsService } from "../../services/api";
import logoImage from "../../imports/TelaEntrarDesktop/6c9468368cc2baf3fccf383eb020a4c273a1c528.png"

interface BoxesProps {
  onBack?: () => void;
}

interface Box {
  id: string;
  title: string;
  icon: any;
  target: number;
  current: number;
  color: string;
  category: string;
  startDate: string;
  monthlyGoal: number;
  earnings: number;
}

const BOX_COLORS = ["bg-[#5bb49b]", "bg-[#618c78]", "bg-[#3fa8a2]", "bg-[#88a983]", "bg-[#7bb1f1]", "bg-[#c18c00]"];
const BOX_ICONS = [Wallet, Shield, Target, Plane, Laptop, Home, GraduationCap, ShoppingBag];

export default function Boxes({ onBack }: BoxesProps) {
  const { user } = useAuth();
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [activeView, setActiveView] = useState("caixinhas");
  
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);

  // CORREÇÃO: Estados do Modal agora estão DENTRO do componente!
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    nome: "", valorAlvo: "", categoria: "essencial", metaMensal: "" 
  });

  // CORREÇÃO: A função de criar caixinha também precisa estar DENTRO, 
  // para ter acesso à variável `user` e aos `formData`
  const handleCreateBox = async () => {
    try {
      await goalService.criar({
        userId: user?.userId, // Adicionado ? por segurança caso user seja undefined momentaneamente
        nome: formData.nome,
        valorAlvo: parseFloat(formData.valorAlvo),
        categoria: formData.categoria,
        metaMensal: parseFloat(formData.metaMensal),
        icone: "Wallet" // Padrão
      });
      setIsModalOpen(false);
      // Recarrega a lista após criar
      window.location.reload(); 
    } catch (error) {
      alert("Erro ao criar caixinha");
    }
  };

  // Busca as caixinhas reais do PostgreSQL
  useEffect(() => {
    if (user?.userId) {
      goalService.listar(user.userId)
        .then((dadosDoBanco) => {
          const caixinhasMapeadas = dadosDoBanco.map((meta: any, index: number) => ({
            id: meta.id,
            title: meta.nome,
            target: meta.valorAlvo || 0,
            current: meta.valorAtual || 0,
            color: BOX_COLORS[index % BOX_COLORS.length], 
            icon: BOX_ICONS[index % BOX_ICONS.length],
            category: "essencial",
            startDate: "Atual", 
            monthlyGoal: 400, // Valor padrão de simulação para os cálculos das metas
            earnings: 0 
          }));
          setBoxes(caixinhasMapeadas);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const viewOptions = [
    { id: "caixinhas", label: "Minhas Caixinhas", icon: Wallet },
    { id: "metas", label: "Metas", icon: Target },
    { id: "analises", label: "Análises", icon: BarChart3 },
    { id: "config", label: "Configurações", icon: Settings }
  ];

  const totalSaved = boxes.reduce((sum, box) => sum + box.current, 0);
  const totalEarnings = boxes.reduce((sum, box) => sum + (box.current * 0.06), 0);

  if (selectedBox) {
    return <BoxDetail box={selectedBox} onBack={() => setSelectedBox(null)} />;
  }

  return (
    <div className="h-full overflow-auto bg-white md:bg-gray-50 font-inter">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#101828]" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-[#101828]">Caixinhas</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-[#6a7282]" />
          </button>
        </div>
      </div>

      <div className="pb-20 max-w-7xl mx-auto">
        {/* Total Banner */}
        <div
          className="mx-4 md:mx-8 mt-4 md:mt-6 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ background: "linear-gradient(127deg, rgb(97, 140, 120) 26%, rgb(123, 241, 168) 113%)" }}
        >
          <div className="absolute left-4 bottom-0 w-24 h-24 opacity-90">
            <div className="relative w-full h-full">
              <div className="absolute bottom-9 left-1.5 w-20 h-20 bg-[#3fa8a2] rounded-full opacity-30" />
                <img 
                  src={logoImage} 
                  alt="Mascote" 
                  className="absolute bottom-13 left-6 w-12 h-auto drop-shadow-md"/>
              </div>
          </div>

          <div className="ml-24 relative z-10">
            <p className="text-base text-white/90 mb-2">Total guardado</p>
            <p className="text-3xl font-bold text-white mb-3">
              R$ {loading ? "..." : totalSaved.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-white/90">
              Suas caixinhas já renderam{" "}
              <span className="font-bold">
                R$ {loading ? "..." : totalEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>

        {/* View Options */}
        <div className="px-4 md:px-8 mt-6 mb-4">
          <div className="flex gap-4 md:gap-6 justify-center">
            {viewOptions.map((option) => {
              const OptionIcon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setActiveView(option.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeView === option.id
                        ? "bg-[#618c78] shadow-lg scale-110"
                        : "bg-[#f4f4f4] hover:bg-[#e5e7eb] hover:scale-105"
                    }`}
                  >
                    <OptionIcon
                      className={`w-6 h-6 md:w-7 md:h-7 transition-colors ${
                        activeView === option.id ? "text-white" : "text-[#6a7282]"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold text-center max-w-[70px] transition-colors ${
                      activeView === option.id ? "text-[#618c78]" : "text-[#6a7282]"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Based on Active View */}
        {activeView === "caixinhas" && (
          <div className="px-4 md:px-8">
            {loading ? (
              <div className="text-center py-10 text-gray-400 font-medium">Buscando suas caixinhas...</div>
            ) : boxes.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium">Você ainda não possui caixinhas criadas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {boxes.map((box) => {
                  const progress = box.target > 0 ? (box.current / box.target) * 100 : 0;
                  const BoxIcon = box.icon;

                  return (
                    <button
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 hover:shadow-xl hover:scale-105 hover:border-[#618c78]/30 transition-all duration-300 text-left"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`${box.color} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}>
                          <BoxIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#101828] line-clamp-2 mb-1">
                            {box.title}
                          </h3>
                          <p className="text-xs text-[#6a7282]">
                            Meta: R$ {box.target.toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-bold text-[#101828]">
                            R$ {box.current.toLocaleString("pt-BR")}
                          </span>
                          <span className="text-sm font-bold text-[#618c78]">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${box.color} rounded-full transition-all`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-[#618c78]">
                        💰 Rendeu R$ {(box.current * 0.06).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeView === "metas" && (
          <div className="px-4 md:px-8">
            {/* Monthly Goal Card */}
            <div className="bg-gradient-to-br from-[#618c78] to-[#5bb49b] rounded-3xl p-5 mb-4 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-white/80 mb-1">Meta Mensal</p>
                  <p className="text-3xl font-bold">R$ 2.800</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/90">R$ {totalSaved.toLocaleString("pt-BR")} economizados</span>
                  <span className="font-bold">{Math.min(Math.round((totalSaved / 2800) * 100), 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((totalSaved / 2800) * 100, 100)}%` }} />
                </div>
              </div>
              <p className="text-xs text-white/80">
                {totalSaved >= 2800 ? "Parabéns! Meta mensal atingida!" : `Faltam R$ ${(2800 - totalSaved).toLocaleString("pt-BR")} para atingir sua meta`}
              </p>
            </div>

            {/* Goals by Box */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#101828] mb-3">Metas por Caixinha</h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-sm text-gray-400">Carregando metas...</div>
                ) : (
                  boxes.map((box) => {
                    const progress = box.target > 0 ? (box.current / box.target) * 100 : 0;
                    const BoxIcon = box.icon;
                    const remaining = box.target - box.current;
                    const monthsRemaining = Math.ceil(remaining / (box.monthlyGoal || 1));

                    return (
                      <div key={box.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`${box.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                            <BoxIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-[#101828]">{box.title}</h4>
                            <p className="text-xs text-[#6a7282]">
                              {remaining <= 0 ? "Meta atingida!" : `${monthsRemaining} meses restantes`}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6a7282]">Meta mensal simulada: R$ {box.monthlyGoal.toLocaleString("pt-BR")}</span>
                            <span className="font-bold text-[#618c78]">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${box.color} rounded-full transition-all`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💡</div>
                <div>
                  <h4 className="text-sm font-bold text-[#101828] mb-1">Dica de Meta</h4>
                  <p className="text-xs text-[#6a7282]">
                    Você está evoluindo as suas economias! Continue focado nas suas caixinhas ativas no sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "analises" && (
          <div className="px-4 md:px-8">
            <div className="text-center mb-6">
              <p className="text-sm text-[#a2a2a7] mb-2">Total Economizado</p>
              <p className="text-3xl font-bold text-[#101828] mb-6">
                R$ {totalSaved.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>

              {/* Simple Chart */}
              <div className="relative h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 335 130" fill="none">
                  <line x1="0" y1="0" x2="0" y2="130" stroke="#f4f4f4" strokeWidth="1.5" />
                  <line x1="60" y1="0" x2="60" y2="90" stroke="#f4f4f4" strokeWidth="1.5" />
                  <line x1="120" y1="0" x2="120" y2="110" stroke="#f4f4f4" strokeWidth="1.5" />
                  <line x1="180" y1="0" x2="180" y2="40" stroke="#f4f4f4" strokeWidth="1.5" />
                  <line x1="240" y1="0" x2="240" y2="95" stroke="#f4f4f4" strokeWidth="1.5" />
                  <line x1="300" y1="0" x2="300" y2="50" stroke="#f4f4f4" strokeWidth="1.5" />

                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#618c78" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#618c78" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path
                    d="M 0 120 L 300 20 L 300 130 L 0 130 Z"
                    fill="url(#chartGradient)"
                    stroke="none"
                  />

                  <path
                    d="M 0 120 L 300 20"
                    fill="none"
                    stroke="#618c78"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle cx="0" cy="120" r="4.5" fill="#618c78" stroke="white" strokeWidth="2" />
                  <circle cx="60" cy="100" r="4.5" fill="#618c78" stroke="white" strokeWidth="2" />
                  <circle cx="120" cy="80" r="4.5" fill="#618c78" stroke="white" strokeWidth="2" />
                  <circle cx="180" cy="60" r="4.5" fill="#618c78" stroke="white" strokeWidth="2" />
                  <circle cx="240" cy="40" r="4.5" fill="#618c78" stroke="white" strokeWidth="2" />
                  <circle cx="300" cy="20" r="4.5" fill="#618c78" stroke="white" strokeWidth="2" />
                </svg>
              </div>

              {/* Month Selector */}
              <div className="flex gap-3 justify-center mb-6">
                {["Out", "Nov", "Dez", "Jan", "Fev", "Mar"].map((month, index) => (
                  <button
                    key={month}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      index === 3 ? "bg-[#618c78] text-white" : "text-[#a2a2a7]"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#101828]">Atividade Recente</h3>
                <button className="text-sm text-[#a2a2a7] font-medium">Ver Tudo</button>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-sm text-gray-400">Carregando atividades...</div>
                ) : (
                  boxes.slice(0, 4).map((box) => {
                    const BoxIcon = box.icon;
                    return (
                      <div key={box.id} className="flex items-center gap-3">
                        <div className={`${box.color} w-10 h-10 rounded-2xl flex items-center justify-center shrink-0`}>
                          <BoxIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#101828]">{box.title}</p>
                          <p className="text-xs text-[#a2a2a7]">Economia ativa</p>
                        </div>
                        <p className="text-sm font-semibold text-[#618c78]">
                          + R$ {box.current.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === "config" && (
          <div className="px-4 md:px-8">
            {/* Notifications Section */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#6a7282] uppercase tracking-wide mb-3">
                Notificações
              </h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#101828]">Lembretes de Economia</p>
                      <p className="text-xs text-[#6a7282]">Receba notificações diárias</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-[#618c78] rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </button>
                <div className="h-px bg-gray-200" />
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#101828]">Alertas de Metas</p>
                      <p className="text-xs text-[#6a7282]">Quando atingir uma meta</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-[#618c78] rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </button>
              </div>
            </div>

            {/* Savings Settings */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#6a7282] uppercase tracking-wide mb-3">
                Economia
              </h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#101828]">Taxa de Rendimento</p>
                      <p className="text-xs text-[#6a7282]">Configure a taxa de juros</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6a7282]" />
                </button>
                <div className="h-px bg-gray-200" />
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#101828]">Depósitos Automáticos</p>
                      <p className="text-xs text-[#6a7282]">Configure valores mensais</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6a7282]" />
                </button>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#6a7282] uppercase tracking-wide mb-3">
                Dados e Privacidade
              </h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Download className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#101828]">Exportar Dados</p>
                      <p className="text-xs text-[#6a7282]">Baixe seus relatórios</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6a7282]" />
                </button>
                <div className="h-px bg-gray-200" />
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#101828]">Privacidade</p>
                      <p className="text-xs text-[#6a7282]">Gerencie suas preferências</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6a7282]" />
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="text-sm font-bold text-[#101828] mb-1">Sobre as Caixinhas</h4>
                  <p className="text-xs text-[#6a7282] mb-2">
                    Versão 1.0.0 - Suas economias estão seguras e protegidas.
                  </p>
                  <button className="text-xs text-[#618c78] font-semibold">
                    Ver Termos de Uso
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Box - Only on Caixinhas view */}
        {activeView === "caixinhas" && (
          <div className="px-4 md:px-8 mt-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-[#88a983] to-[#3fa8a2] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              + Criar Nova Caixinha
            </button>
          </div>
        )}
      </div>

      {/* Modal Render */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-[#101828]">Nova Caixinha</h2>
            <input 
              className="w-full p-3 mb-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#618c78] transition-all"
              placeholder="Nome da meta"
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
            <input 
              className="w-full p-3 mb-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#618c78] transition-all"
              placeholder="Valor alvo (R$)"
              type="number"
              onChange={(e) => setFormData({...formData, valorAlvo: e.target.value})}
            />
            <input 
              className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#618c78] transition-all"
              placeholder="Meta mensal (R$)"
              type="number"
              onChange={(e) => setFormData({...formData, metaMensal: e.target.value})}
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-[#6a7282] hover:bg-gray-50 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateBox}
                className="flex-1 bg-[#618c78] hover:bg-[#5bb49b] text-white py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}