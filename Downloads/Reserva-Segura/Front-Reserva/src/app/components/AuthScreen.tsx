import { ChangeEvent, useState } from "react";
import { User, Mail, Lock, CreditCard } from "lucide-react";
import { authService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import imgDinosaur from "../../imports/TelaEntrarDesktop/6c9468368cc2baf3fccf383eb020a4c273a1c528.png";

interface AuthScreenProps {
  onLogin: () => void;
}

interface FormFieldsProps {
  mode: "login" | "signup";
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  loading: boolean;
  onNomeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCpfChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSenhaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void> | void;
}

function FormFields({
  mode,
  nome,
  cpf,
  email,
  senha,
  loading,
  onNomeChange,
  onCpfChange,
  onEmailChange,
  onSenhaChange,
  onSubmit,
}: FormFieldsProps) {
  return (
    <div className="space-y-4">
      {mode === "signup" && (
        <>
          <div>
            <label className="block text-sm font-semibold text-[#364153] mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-[#99A1AF]" />
              </div>
              <input
                type="text"
                value={nome}
                onChange={onNomeChange}
                placeholder="Seu nome"
                className="w-full h-14 bg-[rgba(97,140,120,0.32)] rounded-2xl pl-14 pr-4 flex items-center text-[16px] text-[#101828] placeholder-[rgba(10,10,10,0.5)] outline-none focus:ring-2 focus:ring-[#618c78] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#364153] mb-2">
              CPF
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <CreditCard className="w-5 h-5 text-[#99A1AF]" />
              </div>
              <input
                type="text"
                value={cpf}
                onChange={onCpfChange}
                placeholder="000.000.000-00"
                className="w-full h-14 bg-[rgba(97,140,120,0.32)] rounded-2xl pl-14 pr-4 flex items-center text-[16px] text-[#101828] placeholder-[rgba(10,10,10,0.5)] outline-none focus:ring-2 focus:ring-[#618c78] transition-all"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-semibold text-[#364153] mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Mail className="w-5 h-5 text-[#99A1AF]" />
          </div>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="seu.email@exemplo.com"
            className="w-full h-14 bg-[rgba(97,140,120,0.32)] rounded-2xl pl-14 pr-4 flex items-center text-[16px] text-[#101828] placeholder-[rgba(10,10,10,0.5)] outline-none focus:ring-2 focus:ring-[#618c78] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#364153] mb-2">
          Senha
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-[#99A1AF]" />
          </div>
          <input
            type="password"
            value={senha}
            onChange={onSenhaChange}
            placeholder="••••••••"
            className="w-full h-14 bg-[rgba(97,140,120,0.32)] rounded-2xl pl-14 pr-4 flex items-center text-[16px] text-[#101828] placeholder-[rgba(10,10,10,0.5)] outline-none focus:ring-2 focus:ring-[#618c78] transition-all"
          />
        </div>
      </div>

      {mode === "login" && (
        <div className="flex justify-center mt-2">
          <button className="text-sm font-semibold text-[#096]">
            Esqueceu a senha?
          </button>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full h-14 bg-[#618c78] text-white rounded-2xl font-semibold text-[16px] hover:bg-[#4a7862] transition-colors mt-6 disabled:opacity-70"
      >
        {loading ? "A carregar..." : mode === "login" ? "Entrar" : "Criar Conta"}
      </button>
    </div>
  );
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { login } = useAuth();

  // Estados para capturar os dados digitados
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para formatar o CPF enquanto o utilizador digita
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
  };

  // Função central de submissão (Login ou Registo)
  const handleSubmit = async () => {
    if (!email || !senha || (mode === "signup" && (!nome || !cpf))) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const resposta = await authService.login({ email, senha });
        login(resposta); // Salva token e user no AuthContext
        onLogin();       // Liberta o acesso para o App.tsx
      } else {
        const cleanCpf = cpf.replace(/\D/g, ""); // Envia só os números para o backend
        await authService.register({ nome, email, cpf: cleanCpf, senha });
        alert("Conta criada com sucesso! Faça login para continuar.");
        setMode("login");
      }
    } catch (error: any) {
      alert(error.message || "Ocorreu um erro na autenticação. Verifique os seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Version */}
      <div
        className="md:hidden fixed inset-0 overflow-auto"
        style={{
          background: "linear-gradient(180deg, rgb(149, 179, 135) 0%, rgb(97, 140, 120) 50%, rgb(202, 217, 150) 100%)"
        }}
      >
        <div className="min-h-full flex flex-col animate-in fade-in duration-500">
          <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
            <div className="mb-8 animate-in zoom-in duration-700 delay-100">
              <div className="text-9xl drop-shadow-lg">🦖</div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Reserva Segura
            </h1>
            <p className="text-white/80 text-center mb-8">
              Prepare-se para o futuro financeiro com segurança.
            </p>

            <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl animate-in slide-in-from-bottom-8 duration-500 delay-200 relative z-20">
              <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    mode === "login" ? "bg-white text-[#101828] shadow-sm" : "text-[#6a7282]"
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    mode === "signup" ? "bg-white text-[#101828] shadow-sm" : "text-[#6a7282]"
                  }`}
                >
                  Cadastrar
                </button>
              </div>
              
                      {/* Renderiza os Inputs Reais aqui */}
              <FormFields
                mode={mode}
                nome={nome}
                cpf={cpf}
                email={email}
                senha={senha}
                loading={loading}
                onNomeChange={(e) => setNome(e.target.value)}
                onCpfChange={handleCpfChange}
                onEmailChange={(e) => setEmail(e.target.value)}
                onSenhaChange={(e) => setSenha(e.target.value)}
                onSubmit={handleSubmit}
              />

            </div>
          </div>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:flex min-h-screen items-center justify-center px-6 py-10 bg-[#f8f9fb]">
        <div className="w-full max-w-6xl h-[691px] flex rounded-3xl shadow-2xl overflow-hidden bg-white">
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              backgroundImage: "linear-gradient(-53.1381deg, rgb(149, 179, 135) 30.847%, rgb(97, 140, 120) 61.173%, rgb(202, 217, 150) 91.499%)"
            }}
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <div className="absolute left-12 top-24 text-white z-10 pointer-events-none">
              <h1 className="text-[32px] font-semibold mb-16">Reserva Segura</h1>
              <h2 className="text-[56px] font-bold leading-[64px] mb-6">
                Prepare-se para<br />o futuro
              </h2>
              <p className="text-[24px] text-white/90 leading-[31px] max-w-md">
                Aprenda a poupar, gerencie suas metas e evolua no seu percurso financeiro.
              </p>
            </div>
            <div className="absolute left-[150px] bottom-[10px] w-[200px] h-[200px] flex items-center justify-center pointer-events-none z-30">
              <img
                src={imgDinosaur}
                alt="Reserva Segura mascot"
                className="w-[450px] h-[450px] object-contain pointer-events-none"
                style={{ marginTop: -100, marginLeft: 480, transform: "scaleX(-1)"}}
              />
            </div>
          </div>

          <div className="w-[560px] bg-white rounded-l-[76px] flex items-center justify-center px-16 relative z-20">
            <div className="w-full max-w-md">
              <div className="flex gap-2 mb-12">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-3 rounded-2xl font-semibold text-[16px] transition-all ${
                    mode === "login" ? "bg-[#618c78] text-white" : "bg-[#f3f4f6] text-[#4a5565]"
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-3 rounded-2xl font-semibold text-[16px] transition-all ${
                    mode === "signup" ? "bg-[#618c78] text-white" : "bg-[#f3f4f6] text-[#4a5565]"
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              <div className="space-y-6">
                <FormFields
                  mode={mode}
                  nome={nome}
                  cpf={cpf}
                  email={email}
                  senha={senha}
                  loading={loading}
                  onNomeChange={(e) => setNome(e.target.value)}
                  onCpfChange={handleCpfChange}
                  onEmailChange={(e) => setEmail(e.target.value)}
                  onSenhaChange={(e) => setSenha(e.target.value)}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}