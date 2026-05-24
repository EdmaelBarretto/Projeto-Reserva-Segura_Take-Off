import { ArrowLeft, Download, Calendar, Target, TrendingUp } from "lucide-react";
import { useState } from "react"; // CORREÇÃO: Faltava importar o useState
import { Line, Bar } from "recharts";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { goalService } from "../../services/api";
import { useAuth } from "../../context/AuthContext"; // CORREÇÃO: Faltava importar o useAuth

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

interface BoxDetailProps {
  box: Box;
  onBack: () => void;
}

export default function BoxDetail({ box, onBack }: BoxDetailProps) {
  // CORREÇÃO: O useAuth precisa ser chamado para termos acesso ao user
  const { user } = useAuth();
  
  // CORREÇÃO: Os estados devem estar DENTRO da função do componente
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const progress = box.target > 0 ? (box.current / box.target) * 100 : 0;
  const remaining = Math.max(box.target - box.current, 0); // Evita números negativos se passar da meta
  const BoxIcon = box.icon;

  // Mock data for growth chart
  const growthData = [
    { month: "Jan", value: 600 },
    { month: "Fev", value: 1200 },
    { month: "Mar", value: 1800 },
    { month: "Abr", value: 2400 },
    { month: "Mai", value: 3200 }
  ];

  // Mock data for deposits vs earnings
  const depositsData = [
    { month: "Jan", deposits: 400, earnings: 20 },
    { month: "Fev", deposits: 450, earnings: 45 },
    { month: "Mar", deposits: 500, earnings: 80 },
    { month: "Abr", deposits: 400, earnings: 65 },
    { month: "Mai", deposits: 450, earnings: 75 }
  ];

  // CORREÇÃO: Funções agora estão DENTRO do componente
  const handleDeposit = async () => {
    try {
      const valor = parseFloat(inputValue);
      if (isNaN(valor) || valor <= 0) return alert("Insira um valor válido de depósito.");

      await goalService.depositar(user?.userId, box.id, valor);    
      setIsDepositOpen(false);
      setInputValue("");
      window.location.reload(); 
    } catch (error: any) {
      // Aqui está a mágica: vamos capturar o erro exato do back-end!
      console.error("Erro detalhado:", error);
      if (error.response && error.response.data) {
        alert("Erro do Servidor: " + JSON.stringify(error.response.data));
      } else {
        alert("Erro de conexão: " + error.message);
      }
    }
  };

  const handleWithdraw = async () => {
    try {
      const valor = parseFloat(inputValue);
      if (isNaN(valor) || valor <= 0) return alert("Insira um valor válido de saque.");
      if (valor > box.current) return alert("Saldo insuficiente nesta caixinha.");

      await goalService.sacar(user?.userId, box.id, valor);
      setIsWithdrawOpen(false);
      setInputValue("");
      window.location.reload(); 
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      if (error.response && error.response.data) {
        alert("Erro do Servidor: " + JSON.stringify(error.response.data));
      } else {
        alert("Erro de conexão: " + error.message);
      }
    }
  };
  
  return (
    <div className="h-full overflow-auto bg-[#f9fafb]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-[#101828]" />
            </button>
            <h1 className="text-xl font-bold text-[#101828]">Detalhes</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Download className="w-5 h-5 text-[#6a7282]" />
          </button>
        </div>
      </div>

      <div className="p-4 pb-6 space-y-4">
        {/* Main Card */}
        <div
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgb(97, 140, 120) 0%, rgb(95, 180, 155) 100%)" }}
        >
          {/* Header with Icon */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <BoxIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{box.title}</h2>
              <p className="text-sm text-white/80">Meta: R$ {box.target.toLocaleString("pt-BR")}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
            <p className="text-xs text-white/80 mb-2">Progresso</p>
            <div className="flex items-end gap-3 mb-3">
              <p className="text-4xl font-bold text-white">
                R$ {box.current.toLocaleString("pt-BR")}
              </p>
              <p className="text-xl font-bold text-white/90 pb-1">{Math.round(progress)}%</p>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
              <p className="text-xs text-white/80 mb-1">Falta</p>
              <p className="text-lg font-bold text-white">R$ {remaining.toLocaleString("pt-BR")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
              <p className="text-xs text-white/80 mb-1">Rendimento</p>
              <p className="text-lg font-bold text-white">
                R$ {(box.current * 0.06).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <Calendar className="w-5 h-5 text-[#618c78] mx-auto mb-2" />
            <p className="text-xs text-[#6a7282] mb-1">Início</p>
            <p className="text-sm font-bold text-[#101828]">{box.startDate}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <Target className="w-5 h-5 text-[#618c78] mx-auto mb-2" />
            <p className="text-xs text-[#6a7282] mb-1">Meta</p>
            <p className="text-sm font-bold text-[#101828]">Ago/26</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <TrendingUp className="w-5 h-5 text-[#618c78] mx-auto mb-2" />
            <p className="text-xs text-[#6a7282] mb-1">Mensal</p>
            <p className="text-sm font-bold text-[#101828]">R$ {box.monthlyGoal}</p>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#618c78]" />
            <h3 className="text-lg font-bold text-[#101828]">Análise de Crescimento</h3>
          </div>
          <p className="text-sm text-[#6a7282] mb-4">Evolução Mensal</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6a7282" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6a7282" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#618c78"
                strokeWidth={3}
                dot={{ fill: "#618c78", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deposits vs Earnings Chart */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200">
          <h3 className="text-lg font-bold text-[#101828] mb-4">Depósitos vs Rendimento</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={depositsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6a7282" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6a7282" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="deposits" fill="#88a983" radius={[8, 8, 0, 0]} />
              <Bar dataKey="earnings" fill="#7bf1a8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => { setInputValue(""); setIsDepositOpen(true); }}
            className="w-full bg-gradient-to-r from-[#88a983] to-[#3fa8a2] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Adicionar Valor
          </button>
          <button 
            onClick={() => { setInputValue(""); setIsWithdrawOpen(true); }}
            className="w-full bg-white text-[#618c78] border-2 border-[#618c78] py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          > 
            Sacar Parcialmente
          </button>
        </div>
      </div>
      
      {/* Modal de Adicionar Valor (Depósito) */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-[#101828]">Adicionar Valor</h2>
            <p className="text-sm text-gray-500 mb-4">Quanto você deseja guardar na caixinha "{box.title}"?</p>
            
            <div className="relative mb-4">
              <span className="absolute left-3 top-3.5 text-gray-400 font-semibold">R$</span>
              <input 
                className="w-full p-3 pl-9 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#618c78] transition-all font-semibold text-lg"
                placeholder="0,00"
                type="number"
                step="0.01"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDepositOpen(false)}
                className="flex-1 py-3 text-[#6a7282] hover:bg-gray-50 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeposit}
                className="flex-1 bg-[#618c78] hover:bg-[#5bb49b] text-white py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sacar Valor (Retirada) */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-[#101828]">Sacar Parcialmente</h2>
            <p className="text-sm text-gray-500 mb-1">Quanto deseja retirar de "{box.title}"?</p>
            <p className="text-xs text-[#618c78] font-semibold mb-4">Disponível: R$ {box.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            
            <div className="relative mb-4">
              <span className="absolute left-3 top-3.5 text-gray-400 font-semibold">R$</span>
              <input 
                className="w-full p-3 pl-9 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c18c00] transition-all font-semibold text-lg"
                placeholder="0,00"
                type="number"
                step="0.01"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsWithdrawOpen(false)}
                className="flex-1 py-3 text-[#6a7282] hover:bg-gray-50 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleWithdraw}
                className="flex-1 bg-[#618c78] hover:bg-[#5bb49b] text-white py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                Sacar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}