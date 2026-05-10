import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jacareImg from '../assets/jacare.png';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Formata CPF enquanto digita: 000.000.000-00
  const formatarCpf = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Remove máscara do CPF antes de enviar
      const cpfLimpo = cpf.replace(/\D/g, '');

      // Chama POST /auth/register no back
      const resposta = await authService.register({
        nome,
        email,
        cpf: cpfLimpo,
        senha,
      });

      // Salva no contexto e redireciona
      login(resposta);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#4d6b51] via-[#3a5240] to-[#253629] flex flex-col md:flex-row items-center overflow-x-hidden relative font-sans">

      {/* SEÇÃO ESQUERDA */}
      <div className="relative z-30 px-6 pt-12 pb-6 md:pt-0 md:pb-0 md:pl-24 w-full md:w-[50%] h-auto md:h-full flex flex-col justify-center items-start text-left text-white">
        <div className="flex flex-row md:flex-col justify-between items-end md:items-start w-full relative">
          <div className="w-[60%] md:w-full flex flex-col items-start text-left">
            <p className="text-base md:text-2xl font-medium mb-1 md:mb-2 opacity-95 drop-shadow-sm">Reserva Segura</p>
            <h1 className="text-3xl md:text-[66px] font-bold leading-[1.1] mb-3 md:mb-6 drop-shadow-md tracking-tight">Prepare-se para o futuro</h1>
            <p className="text-[13px] md:text-xl leading-snug opacity-80 font-medium max-w-[95%] md:max-w-md">
              Aprenda a criar cofrinhos personalizados e alcance seus objetivos financeiros com facilidade.
            </p>
          </div>
          <div className="md:hidden flex-1 flex justify-end relative self-end">
            <img src={jacareImg} alt="Mascote" className="w-[150px] drop-shadow-2xl absolute bottom-0 -right-2 z-50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* JACARÉ DESKTOP */}
      <div className="hidden md:flex w-full justify-center relative z-40 md:fixed md:w-[480px] md:bottom-0 md:left-[45%] md:translate-x-[-50%] md:z-50 md:flex-col md:items-center pointer-events-none">
        <img src={jacareImg} alt="Mascote" className="md:w-[500px] relative z-10" />
      </div>

      {/* PAINEL BRANCO */}
      <div className="w-full md:w-[50%] min-h-[82vh] md:h-screen bg-white rounded-t-[50px] md:rounded-t-none md:rounded-l-[110px] shadow-2xl flex flex-col justify-start md:justify-center items-center z-20 mt-auto md:mt-0 relative">
        <div className="w-full max-w-md px-8 pt-10 md:pt-0">

          <div className="flex bg-[#f3f5f4] p-1.5 rounded-full mb-6 border border-gray-100 shadow-inner">
            <button onClick={() => navigate('/login')} className="flex-1 text-[#567462] py-3 font-bold opacity-60 cursor-pointer">
              Entrar
            </button>
            <button className="flex-1 bg-[#567462] text-white py-3 rounded-full font-bold shadow-md cursor-default">
              Cadastrar
            </button>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {erro}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleCadastro}>
            <div className="space-y-1">
              <label className="text-[#3a5240] font-bold text-[10px] uppercase ml-1 opacity-70">Nome Completo</label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-[#567462] opacity-60 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Seu nome aqui"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full bg-[#f3f5f4] pl-12 p-4 rounded-xl outline-none border border-transparent focus:border-[#567462]/30 transition-all text-[#3a5240]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#3a5240] font-bold text-[10px] uppercase ml-1 opacity-70">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-[#567462] opacity-60 pointer-events-none" />
                <input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#f3f5f4] pl-12 p-4 rounded-xl outline-none border border-transparent focus:border-[#567462]/30 transition-all text-[#3a5240]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#3a5240] font-bold text-[10px] uppercase ml-1 opacity-70">CPF</label>
              <div className="relative flex items-center">
                <CreditCard className="absolute left-4 w-5 h-5 text-[#567462] opacity-60 pointer-events-none" />
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatarCpf(e.target.value))}
                  required
                  className="w-full bg-[#f3f5f4] pl-12 p-4 rounded-xl outline-none border border-transparent focus:border-[#567462]/30 transition-all text-[#3a5240]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#3a5240] font-bold text-[10px] uppercase ml-1 opacity-70">Senha</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-[#567462] opacity-60 pointer-events-none" />
                <input
                  type={passwordHidden ? 'password' : 'text'}
                  placeholder="********"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full bg-[#f3f5f4] pl-12 pr-12 p-4 rounded-xl outline-none border border-transparent focus:border-[#567462]/30 transition-all text-[#3a5240]"
                />
                <button type="button" onClick={() => setPasswordHidden(!passwordHidden)} className="absolute right-4 cursor-pointer">
                  {passwordHidden ? <EyeOff className="w-5 h-5 text-[#567462] opacity-60" /> : <Eye className="w-5 h-5 text-[#567462] opacity-60" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#567462] text-white py-4 rounded-xl font-bold text-lg mt-4 shadow-lg active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              {carregando ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <p className="text-center text-[#567462] font-medium text-sm mt-6">
            Já tem uma conta? <span onClick={() => navigate('/login')} className="font-bold cursor-pointer hover:underline">Faça login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
