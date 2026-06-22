import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Shield, Eye, EyeOff, Lock, Mail, ArrowLeft, RefreshCw, KeyRound, Radio } from 'lucide-react';
import { Usuario } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: Usuario) => void;
  onBackToHome: () => void;
}

export default function LoginPage({ onLoginSuccess, onBackToHome }: LoginPageProps) {
  const [activeForm, setActiveForm] = useState<'login' | 'recover' | 'register' | 'twoFA'>('login');
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Registration States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEmpName, setRegEmpName] = useState('');
  
  // 2FA Simulator States
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFASecret, setTwoFASecret] = useState('ALIEN-LARM-99X-SECURE');
  const [twoFATimer, setTwoFATimer] = useState(30);
  const [twoFACurrentToken, setTwoFACurrentToken] = useState('739 123');
  const [twoFAError, setTwoFAError] = useState('');
  
  // Recover State
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverSent, setRecoverSent] = useState(false);

  // Error/Success Notification
  const [feedError, setFeedError] = useState('');

  // 2FA code generator mock effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeForm === 'twoFA') {
      interval = setInterval(() => {
        setTwoFATimer((prev) => {
          if (prev <= 1) {
            // Generate next token
            const n1 = Math.floor(100 + Math.random() * 900);
            const n2 = Math.floor(100 + Math.random() * 900);
            setTwoFACurrentToken(`${n1} ${n2}`);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeForm]);

  // Demo direct login credentials mapping
  const DEMO_CREDENTIALS = [
    { nome: 'Master Admin (Global)', email: 'master@alienlarm.com', function: 'MASTER', tag: 'Master Admin' },
    { nome: 'Empresa Admin (SaaS)', email: 'admin@alphaguard.com', function: 'ADMIN', tag: 'Empresa Admin' },
    { nome: 'Técnico Instalador', email: 'sandro@tecnico.com', function: 'TECNICO', tag: 'Técnico' },
    { nome: 'Operador de Central', email: 'op@alphaguard.com', function: 'OPERADOR', tag: 'Operador' },
    { nome: 'Cliente (Aplicativo PWA)', email: 'renato@metalurgicarezende.com.br', function: 'CLIENTE', tag: 'Cliente (PWA)' },
  ];

  const handleDemoQuickClick = (demoEmail: string) => {
    setFeedError('');
    if (demoEmail === 'master@alienlarm.com') {
      const user: Usuario = {
        id: 1,
        uuid: "usr-master-001",
        codigo: "USR-000001",
        nome: "Eng. Rafael - AlienLarm Arquiteto",
        email: "master@alienlarm.com",
        funcao: "MASTER",
        empresaId: null,
        status: "Ativo",
        telefone: "+55 (11) 99999-9999"
      };
      // Require 2FA first to show security mechanics
      setEmail('master@alienlarm.com');
      setActiveForm('twoFA');
    } else if (demoEmail === 'admin@alphaguard.com') {
      setEmail('admin@alphaguard.com');
      const user: Usuario = {
        id: 2,
        uuid: "usr-admin-001",
        codigo: "USR-000002",
        nome: "Maurício Albuquerque",
        email: "admin@alphaguard.com",
        funcao: "ADMIN",
        empresaId: 1, // Alpha Guard Monitoramento
        status: "Ativo",
        telefone: "+55 (11) 98888-0001"
      };
      onLoginSuccess(user);
    } else if (demoEmail === 'sandro@tecnico.com') {
      const user: Usuario = {
        id: 3,
        uuid: "usr-tech-001",
        codigo: "USR-000003",
        nome: "Sandro Instalações",
        email: "sandro@tecnico.com",
        funcao: "TECNICO",
        empresaId: 1,
        status: "Ativo",
        telefone: "+55 (11) 97777-0002"
      };
      onLoginSuccess(user);
    } else if (demoEmail === 'op@alphaguard.com') {
      const user: Usuario = {
        id: 4,
        uuid: "usr-op-001",
        codigo: "USR-000004",
        nome: "Bárbara Oliveira",
        email: "op@alphaguard.com",
        funcao: "OPERADOR",
        empresaId: 1,
        status: "Ativo",
        telefone: "+55 (11) 96666-0003"
      };
      onLoginSuccess(user);
    } else {
      const user: Usuario = {
        id: 5,
        uuid: "usr-client-001",
        codigo: "USR-000005",
        nome: "Renato Rezende (PWA)",
        email: "renato@metalurgicarezende.com.br",
        funcao: "CLIENTE",
        empresaId: 1,
        status: "Ativo",
        telefone: "+55 (11) 95555-0004"
      };
      onLoginSuccess(user);
    }
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedError('');
    if (!email || !password) {
      setFeedError('Por favor preencha todos os campos do sistema.');
      return;
    }

    // Match if it's one of the configured profiles
    const matched = DEMO_CREDENTIALS.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      if (matched.email === 'master@alienlarm.com') {
        setActiveForm('twoFA');
      } else {
        handleDemoQuickClick(matched.email);
      }
    } else {
      // Simulate client user creation
      const user: Usuario = {
        id: 99,
        uuid: "usr-custom-99",
        codigo: "USR-000099",
        nome: email.split('@')[0].toUpperCase(),
        email: email,
        funcao: "ADMIN",
        empresaId: 1,
        status: "Ativo",
        telefone: "+55 (11) 90000-0000"
      };
      onLoginSuccess(user);
    }
  };

  const verifyTwoFA = (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFAError('');
    if (twoFACode.trim().length < 6) {
      setTwoFAError('O token 2FA deve possuir 6 algarismos.');
      return;
    }

    // Success bypass
    const user: Usuario = {
      id: 1,
      uuid: "usr-master-001",
      codigo: "USR-000001",
      nome: "Eng. Rafael - AlienLarm Arquiteto",
      email: "master@alienlarm.com",
      funcao: "MASTER",
      empresaId: null,
      status: "Ativo",
      telefone: "+55 (11) 99999-9999"
    };
    onLoginSuccess(user);
  };

  return (
    <div id="login_root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row relative font-sans">
      {/* Background decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#1435201c,transparent_50%)] pointer-events-none" />

      {/* Left panel: Info & brand */}
      <div className="lg:w-1/2 bg-neutral-900/60 p-12 lg:p-24 flex flex-col justify-between border-r border-emerald-950/35 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
        
        <div className="flex items-center gap-3 cursor-pointer z-10" onClick={onBackToHome}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/40">
            <Terminal className="text-emerald-400 w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider text-white">ALIEN<span className="text-emerald-400">LARM</span></span>
            <span className="block text-[8px] tracking-widest font-mono text-emerald-500 uppercase">Secure Cloud Receivers</span>
          </div>
        </div>

        <div className="my-12 lg:my-0 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded uppercase mb-4">
            <Shield className="w-3.5 h-3.5" /> Segurança SaaS Certificada
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Painel Central do Arquiteto AlienLarm
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-lg mb-8">
            Para fins de auditoria de sistema e demonstração homologada, você pode se autenticar utilizando as contas pré-configuradas do banco de dados na lateral direita ou realizar um cadastro multi-tenant.
          </p>

          {/* Quick bypassing buttons */}
          <div className="bg-neutral-950/70 border border-emerald-950/60 rounded-xl p-6">
            <span className="text-[10px] font-mono text-emerald-500/80 uppercase block mb-3 tracking-widest">
              Atalhos de Homologação (Bypass de Perfis)
            </span>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleDemoQuickClick(demo.email)}
                  className="w-full p-2.5 rounded bg-neutral-900 border border-neutral-800 hover:border-emerald-500/45 text-left text-xs font-mono transition-all flex justify-between items-center text-neutral-300 hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {demo.nome}
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                    {demo.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-neutral-500 z-10 flex items-center gap-2">
          <span className="text-emerald-500">● REST API v4.2S</span>
          <span>|</span>
          <span>Criptografia SHA-256 + JWT de 256 bits</span>
        </div>
      </div>

      {/* Right panel: Form inputs */}
      <div className="lg:w-1/2 p-8 lg:p-24 flex items-center justify-center bg-neutral-950 relative">
        <div className="absolute top-8 right-8">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 font-mono text-xs uppercase tracking-wide border border-neutral-800 hover:border-emerald-500/30 text-neutral-400 hover:text-white rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Início
          </button>
        </div>

        <div className="w-full max-w-md">
          {activeForm === 'login' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-2xl font-bold text-white tracking-tight">Efetuar Autenticação</h3>
              <p className="text-neutral-400 text-xs mt-1.5 mb-8">Insira suas credenciais cadastradas e confirme a autenticação.</p>

              {feedError && (
                <div id="login_error_alert" className="p-3 mb-4 rounded bg-red-950/30 border border-red-500/50 text-red-300 font-mono text-[11px]">
                  {feedError}
                </div>
              )}

              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Endereço de E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@recetora.com"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none rounded-lg p-3 pl-10 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-mono text-neutral-400 uppercase">Senha de Acesso</label>
                    <button
                      type="button"
                      onClick={() => setActiveForm('recover')}
                      className="text-[10px] text-emerald-400 font-mono hover:underline"
                    >
                      Esqueceu a Senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none rounded-lg p-3 pl-10 pr-10 text-sm text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 bg-neutral-900 w-4 h-4 accent-emerald-500"
                    />
                    Lembrar de Mim neste dispositivo
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider font-mono text-xs rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer transition-all mt-4"
                >
                  Entrar no Sistema
                </button>
              </form>

              <div className="mt-8 text-center text-xs text-neutral-500">
                Ainda não tem conta SaaS?{' '}
                <button onClick={() => setActiveForm('register')} className="text-emerald-400 hover:underline font-mono">
                  Cadastrar Nova Empresa
                </button>
              </div>
            </motion.div>
          )}

          {activeForm === 'twoFA' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <KeyRound className="text-emerald-400" /> Autenticação de 2 Fatores
              </h3>
              <p className="text-neutral-400 text-xs mt-1.5 mb-6">
                Como Arquiteto Master Admin, sua conta requer confirmação por QR Token 2FA contra vazamento.
              </p>

              {twoFAError && (
                <div className="p-3 mb-4 rounded bg-red-950/30 border border-red-500/50 text-red-300 font-mono text-[11px]">
                  {twoFAError}
                </div>
              )}

              {/* Holographic 2FA Simulator display */}
              <div className="bg-neutral-900 border border-emerald-950 rounded-xl p-5 text-center font-mono text-xs text-neutral-300 mb-6">
                <span className="text-[10px] text-neutral-500 tracking-widest block uppercase">Simulador de Aplicativo 2FA</span>
                <span className="text-3xl font-extrabold text-emerald-400 block my-3 tracking-wider">{twoFACurrentToken}</span>
                
                <div className="flex justify-center items-center gap-1 text-[10px] text-neutral-500">
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-500" style={{ animationDuration: '4s' }} />
                  Próxima chave em <span className="text-white font-bold">{twoFATimer} segundos</span>
                </div>
                <div className="border-t border-emerald-950/40 my-3.5" />
                <span className="text-[9px] text-neutral-400 uppercase">Segredo: <span className="text-emerald-400/80">{twoFASecret}</span></span>
              </div>

              <form onSubmit={verifyTwoFA} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Insira o código 2FA</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-3 text-center text-xl tracking-[0.6em] text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveForm('login')}
                    className="py-3 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono uppercase tracking-wide cursor-pointer text-center"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs font-mono uppercase tracking-wide cursor-pointer transition-all"
                  >
                    Confirmar Código
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeForm === 'recover' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-2xl font-bold text-white tracking-tight">Recuperação de Senha</h3>
              <p className="text-neutral-400 text-xs mt-1.5 mb-8">
                Informe o seu endereço de e-mail corporativo cadastrado na receptora para receber o token de reset.
              </p>

              {recoverSent ? (
                <div className="p-4 rounded-lg bg-emerald-950/50 border border-emerald-500 text-emerald-300 font-mono text-xs">
                  ✔ Solicitação de reset efetuada! Verifique o Inbox para instruções com o link seguro JWT.
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setRecoverSent(true); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">E-mail Cadastrado</label>
                    <input
                      type="email"
                      required
                      value={recoverEmail}
                      onChange={(e) => setRecoverEmail(e.target.value)}
                      placeholder="admin@suaempresa.com"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-3 text-sm text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider font-mono text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Gerar Novo Token
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveForm('login')}
                    className="w-full text-center text-xs text-neutral-400 font-mono hover:underline mt-2 block"
                  >
                    Lembrei da senha, voltar ao login
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {activeForm === 'register' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-2xl font-bold text-white tracking-tight">Cadastrar Nova Empresa</h3>
              <p className="text-neutral-400 text-xs mt-1.5 mb-6">
                Abra sua conta SaaS AlienLarm de forma instantânea para monitorar seus clientes em nuvem.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                // Create a simulated admin account
                const user: Usuario = {
                  id: Math.floor(Math.random() * 1000) + 10,
                  uuid: "usr-new-registered",
                  codigo: "USR-000210",
                  nome: regName || "Diretor Novo Seg",
                  email: regEmail || "admin@novaseg.com",
                  funcao: "ADMIN",
                  empresaId: 1, // mapped standard Alpha Guard simulation
                  status: "Ativo",
                  telefone: "+55 (11) 98000-1111"
                };
                onLoginSuccess(user);
              }} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Nome Completo do Gestor</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Carlos de Souza"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Nome Fantasia da Empresa</label>
                  <input
                    type="text"
                    required
                    value={regEmpName}
                    onChange={(e) => setRegEmpName(e.target.value)}
                    placeholder="Ex: Solar Seg Alarmes"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="gestor@solarseg.com"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="text-[10px] text-neutral-500 font-mono py-1">
                  Ao clicar em registrar, sua empresa será incluída como tenant <span className="text-emerald-500">EMP-000004</span> conectada ao Plano Enterprise Pro em modo de testes.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider font-mono text-xs rounded-lg transition-all cursor-pointer"
                >
                  Registrar e Acessar
                </button>

                <button
                  type="button"
                  onClick={() => setActiveForm('login')}
                  className="w-full text-center text-xs text-neutral-400 font-mono hover:underline mt-2 block"
                >
                  Já possui conta? Fazer Login
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
