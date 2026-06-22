import { motion } from 'motion/react';
import { Shield, Zap, Terminal, Activity, Server, Smartphone, Mail, ChevronRight, Check, Database, HelpCircle, Star } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onNavigateLogin: (view: 'login' | 'register' | 'demo') => void;
}

export default function LandingPage({ onNavigateLogin }: LandingPageProps) {
  const [demoNome, setDemoNome] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoMsg, setDemoMsg] = useState('');
  const [demoEnviado, setDemoEnviado] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoNome && demoEmail) {
      setDemoEnviado(true);
      setTimeout(() => setDemoEnviado(false), 5000);
      setDemoNome('');
      setDemoEmail('');
      setDemoMsg('');
    }
  };

  return (
    <div id="landing_root" className="min-h-screen bg-neutral-950 text-neutral-100 overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-black">
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1435201c_1px,transparent_1px),linear-gradient(to_bottom,#1435201c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-emerald-700/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Superior Menu Header */}
      <header id="landing_nav" className="sticky top-0 z-50 backdrop-blur-xl border-b border-emerald-950/40 bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Terminal className="text-emerald-400 w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-white">ALIEN<span className="text-emerald-400">LARM</span></span>
              <p className="text-[9px] text-emerald-500/80 tracking-widest font-mono uppercase">Telemetry Receiver SaaS</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#beneficios" className="hover:text-emerald-400 transition-colors">Benefícios</a>
            <a href="#funcionalidades" className="hover:text-emerald-400 transition-colors">Funcionalidades</a>
            <a href="#planos" className="hover:text-emerald-400 transition-colors">Planos Enterprise</a>
            <a href="#pwa" className="hover:text-emerald-400 transition-colors">Aplicativo</a>
            <a href="#contato" className="hover:text-emerald-400 transition-colors">Contato</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateLogin('login')}
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/20 rounded-md transition-all cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => onNavigateLogin('register')}
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-md shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-wide mb-8"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
          SaaS Multi-Tenant de Segurança Integrada e Alta Tolerância
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-5xl"
        >
          A Próxima Geração do Monitoramento de Alarmes na <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent drop-shadow-[#10b981]">Nuvem</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg text-neutral-400 max-w-3xl mb-12 leading-relaxed"
        >
          Sua central receptora simplificada e descentralizada. Alimentada por um motor receiver escalável multi-protocolo, regras de automação avançada e interface inspirada em comandos táticos alienígenas de nível corporativo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button
            onClick={() => onNavigateLogin('demo')}
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold tracking-wide uppercase font-mono rounded-lg bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-bold shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Solicitar Demonstração <ChevronRight className="w-4 h-4" />
          </button>
          <a
            href="#planos"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold tracking-wide uppercase font-mono rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-emerald-600 hover:text-white transition-all text-neutral-300 flex items-center justify-center"
          >
            Ver Planos
          </a>
        </motion.div>

        {/* Interactive Holographic Canvas simulation layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl border border-emerald-950 bg-neutral-950/90 rounded-2xl p-4 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden"
        >
          {/* Bar decor */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-emerald-950/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60 animate-ping" />
              <span className="text-[10px] font-mono text-emerald-500/80 uppercase ml-2">Receiver Engine: Active</span>
            </div>
            <div className="text-xs font-mono text-neutral-500">
              AlienLarm_OS v4.18 // Port 3000 Inbound
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {/* Live activity simulator graphics */}
            <div className="md:col-span-3 bg-neutral-900/80 border border-emerald-950/50 rounded-lg p-4 font-mono select-none">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white flex items-center gap-1.5"><Activity className="w-3 h-3 text-red-500 animate-pulse" /> FILA DE EVENTOS CRÍTICOS</span>
                <span className="text-[9px] bg-red-950 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded uppercase">3 Alertas</span>
              </div>
              <div className="space-y-2 mt-4 text-[11px]">
                <div className="p-2.5 bg-red-950/20 border-l-2 border-red-500 flex justify-between items-center text-red-300 rounded-r">
                  <div>
                    <span className="font-bold text-red-400">[EVT-0130] DISPARO DE INCÊNDIO</span>
                    <p className="text-[10px] text-neutral-400">Metalúrgica Rezende - Central AC-15</p>
                  </div>
                  <span>10s atrás</span>
                </div>
                <div className="p-2.5 bg-amber-950/15 border-l-2 border-amber-500 flex justify-between items-center text-amber-300 rounded-r">
                  <div>
                    <span className="font-bold text-amber-400">[EVT-1121] PÂNICO SILENCIOSO</span>
                    <p className="text-[10px] text-neutral-400">Supermercado Estrela - Teclado Setor 02</p>
                  </div>
                  <span>1m atrás</span>
                </div>
                <div className="p-2.5 bg-emerald-950/10 border-l-2 border-emerald-500 flex justify-between items-center text-emerald-300 rounded-r">
                  <div>
                    <span className="font-bold text-emerald-400">[EVT-3401] CENTRAL DESARMADA</span>
                    <p className="text-[10px] text-neutral-400">Residencial Solar - Usuário 04 (Dr. Pedro)</p>
                  </div>
                  <span>5m atrás</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/80 border border-emerald-950/50 rounded-lg p-4 font-mono text-emerald-500 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Empresas Tenant</span>
                <span className="text-3xl font-bold text-white tracking-widest">1,482</span>
              </div>
              <div className="border-t border-emerald-950/40 my-3" />
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Sinais Recebidos/Min</span>
                <span className="text-2xl font-bold text-emerald-400 tracking-wider">24,192 <span className="text-xs">/s</span></span>
              </div>
              <div className="border-t border-emerald-950/40 my-3" />
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80">
                <Server className="w-3.5 h-3.5 animate-bounce" />
                <span>CPU Load: 4.12%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="bg-neutral-900/40 py-24 border-y border-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest mb-3">Infraestrutura Blindada</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Por que as grandes empresas escolhem o AlienLarm SaaS?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-emerald-950/60 bg-neutral-950/80 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multitenancy Avançado (Zero Vazamento)</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Cada empresa possui sua camada virtual de tenants protegida por criptografia de dados, isolando totalmente relatórios, centrais de clientes e logs.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-emerald-950/60 bg-neutral-950/80 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Engine de Automação "If-Then"</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Dispense rotinas manuais caras. Programe gatilhos inteligentes onde disparos específicos geram tarefas imediatas para despachadores operadores humanos.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-emerald-950/60 bg-neutral-950/80 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Socket Receiver Direto em Nuvem</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Suas centrais conversam direto com nossa receptora em Node.js de latência ultra baixa, traduzindo Contact ID, SIA DC-09 e restrito em tempo real para seu painel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest mb-3">Poder Operacional Sem Limites</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Desenvolvido por quem entende de monitoramento em escala real</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Esqueça as velhas receptoras físicas barulhentas ligadas em computadores velhos do escritório. Com o AlienLarm, sua receptora é baseada em software de alta resiliência, escalando por containers Cloud Run.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Controle de Instalações e Técnicos</h4>
                    <span className="text-xs text-neutral-400">Envie comandos remotos de centrais virtuais para certificar o funcionamento das zonas na etapa de ativação.</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Triagem Rápida IA das Ocorrências</h4>
                    <span className="text-xs text-neutral-400">Classificação inteligente para evitar falsos disparos com acionamento de check-list tático customizado para operadores.</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Contabilidade Inteligente de Assinaturas</h4>
                    <span className="text-xs text-neutral-400">Gerencie planos de mensalidade automáticos para suas empresas licenciadas com emissão integrada e checkout rápido.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative border border-emerald-950 p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
              <div className="text-xs font-mono text-emerald-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 animate-spin" /> SCHEMA CORPORATIVO MULTIEVENTOS
              </div>
              <div className="space-y-3 font-mono text-xs text-emerald-400 bg-neutral-950/90 rounded-lg p-5 border border-emerald-950/50 max-h-96 overflow-y-auto">
                <p className="text-neutral-500">// Definição das 27 Tabelas Relacionais do AlienLarm</p>
                <p className="text-neutral-300">CREATE TABLE <span className="text-white">empresas</span> (</p>
                <p className="pl-4 text-emerald-500/80">uuid CHAR(36) NOT NULL PRIMARY KEY,</p>
                <p className="pl-4 text-emerald-500/80">codigo_empresa VARCHAR(15) UNIQUE,</p>
                <p className="pl-4 text-emerald-500/80">nome_fantasia VARCHAR(255),</p>
                <p className="pl-4 text-emerald-500/80">status ENUM('Ativa', 'Suspensa') DEFAULT 'Ativa'</p>
                <p className="text-neutral-300">);</p>
                <p className="text-neutral-300">CREATE TABLE <span className="text-white">centrais</span> (</p>
                <p className="pl-4 text-emerald-500/80">uuid CHAR(36) PRIMARY KEY,</p>
                <p className="pl-4 text-emerald-500/80">codigo_central VARCHAR(15) UNIQUE,</p>
                <p className="pl-4 text-emerald-500/80">protocolo ENUM('ContactID', 'SIA_DC09', 'JSON', 'MQTT'),</p>
                <p className="pl-4 text-emerald-500/80">FOREIGN KEY (empresa_uuid) REFERENCES empresas(uuid)</p>
                <p className="text-neutral-300">);</p>
                <span className="text-xs text-neutral-500 block animate-pulse">// Pronta para MySQL, PostgreSQL ou MariaDB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aplicativo */}
      <section id="pwa" className="py-24 bg-neutral-900/30 border-t border-emerald-950/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              {/* Phone simulator */}
              <div className="w-72 h-[550px] border-4 border-neutral-800 rounded-[36px] bg-neutral-950 p-3 relative shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-xl flex items-center justify-center">
                  <span className="w-12 h-1 bg-neutral-900 rounded-full" />
                </div>

                <div className="w-full h-full rounded-[28px] overflow-hidden bg-neutral-950 border border-emerald-950/80 flex flex-col justify-between p-4 relative font-mono text-neutral-200">
                  <div className="mt-4 flex justify-between items-center text-[10px] text-neutral-400">
                    <span>AlienLarm Mobile</span>
                    <span className="text-emerald-400 animate-pulse">● LIVE</span>
                  </div>

                  <div className="text-center my-6">
                    <span className="text-[10px] text-neutral-500 tracking-wider">STATUS DO SISTEMA</span>
                    <h4 className="text-xl font-bold text-white mt-1">ARMADO</h4>
                    <p className="text-[9px] text-emerald-400">Zonas Monitoradas Estáveis (04/04)</p>
                  </div>

                  {/* Arm/Disarm Big Shield Button */}
                  <div className="flex justify-center my-4">
                    <div className="w-24 h-24 rounded-full border border-emerald-500/50 bg-emerald-950/40 flex items-center justify-center relative cursor-pointer hover:bg-emerald-950/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <Shield className="w-10 h-10 text-emerald-400" />
                    </div>
                  </div>

                  {/* Camera feed mockup */}
                  <div className="bg-neutral-900 border border-emerald-950 rounded-lg p-2 text-left relative overflow-hidden">
                    <span className="text-[8px] bg-emerald-500 text-neutral-950 px-1 py-0.2 rounded font-bold uppercase absolute top-2 right-2">Cam: Estoque</span>
                    <p className="text-[9px] text-white">ESTOQUE CENTRAL</p>
                    <div className="h-20 bg-neutral-950 border border-emerald-950 rounded mt-1.5 flex items-center justify-center">
                      <span className="text-[9px] text-emerald-500 animate-pulse">FEED EM TEMPO REAL [CRT]</span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded bg-emerald-500 text-neutral-950 font-bold text-xs uppercase tracking-widest mt-4">
                    PWA INSTALADO
                  </button>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest mb-3">Aplicativo Web PWA Integrado</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Poder militar na palma da mão de seus clientes finais</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                As empresas cadastradas no AlienLarm podem entregar uma experiência móvel rica (Progressive Web App) para seus clientes monitorados. O PWA permite:
              </p>

              <ul className="space-y-3.5 text-neutral-300 text-sm">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> Armar e desarmar centrais de qualquer lugar</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> Receber notificações push em tempo real de acidentes</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> Visualização de câmeras IP e abertura de chamados técnicos</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> Funcionamento híbrido offline para logs recentes de pânico</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-24 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest mb-3">Tabela de Preços e Modelos de Assinatura</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Licenciamento SaaS Escalável para Centrais</p>
            <p className="text-neutral-400 text-sm mt-3">Preços flexíveis projetados para se adaptar perfeitamente ao crescimento do seu negócio de segurança eletrônica.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex flex-col justify-between hover:border-emerald-950 transition-all">
              <div>
                <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Iniciante / Piloto</span>
                <h4 className="text-2xl font-bold text-white mt-1">Standard Cosmic</h4>
                <p className="text-neutral-400 text-xs mt-2">Perfeito para empresas instaladoras iniciando no monitoramento corporativo em nuvem.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-white">R$ 299,90</span>
                  <span className="text-neutral-500 text-xs font-mono"> /mês</span>
                </div>
                <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-sm text-neutral-300">
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 50 Centrais Ativas</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 10 Usuários Internos</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Protocolos Contact ID / SIA</p>
                  <p className="flex items-center gap-2 text-neutral-500 line-through"><Check className="w-4 h-4 text-neutral-600" /> WhatsApp Integrado</p>
                  <p className="flex items-center gap-2 text-neutral-500 line-through"><Check className="w-4 h-4 text-neutral-600" /> IA Automação Tática</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateLogin('register')}
                className="w-full mt-8 py-3 rounded-lg border border-neutral-700 bg-neutral-950 font-mono text-xs uppercase text-emerald-400 font-bold hover:bg-emerald-900/10 cursor-pointer transition-all"
              >
                Introduzir Alien
              </button>
            </div>

            {/* Plan 2 */}
            <div className="p-8 rounded-2xl border-2 border-emerald-500/60 bg-neutral-900/80 flex flex-col justify-between relative shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-neutral-950 font-mono text-[9px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                Mais Solicitado ★
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Enterprise Premium</span>
                <h4 className="text-2xl font-bold text-white mt-1">SaaS Enterprise Pro</h4>
                <p className="text-neutral-300 text-xs mt-2">Para centrais com operação profissional montada buscando autonomia total e alta escala.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">R$ 799,90</span>
                  <span className="text-neutral-400 text-xs font-mono"> /mês</span>
                </div>
                <div className="space-y-3 pt-4 border-t border-emerald-950/50 text-sm text-neutral-200">
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 500 Centrais Ativas</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 50 Usuários Internos</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Engine Automatizador IA</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Filtros e Relatórios de Auditoria</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Disparadores WhatsApp integrados</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateLogin('register')}
                className="w-full mt-8 py-3 rounded-lg bg-emerald-500 text-neutral-950 font-mono text-xs uppercase font-bold hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer transition-all"
              >
                Invadir Agora
              </button>
            </div>

            {/* Plan 3 */}
            <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex flex-col justify-between hover:border-emerald-950 transition-all">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Altíssima Densidade</span>
                <h4 className="text-2xl font-bold text-white mt-1">Ultimate Nebula</h4>
                <p className="text-neutral-400 text-xs mt-2">Desenvolvido sob demanda para governos ou operadoras com mais de 2.000 pontos.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-white">R$ 1.499,90</span>
                  <span className="text-neutral-500 text-xs font-mono"> /mês</span>
                </div>
                <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-sm text-neutral-300">
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Centrais Ilimitadas (+2.000)</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Usuários Internos Ilimitados</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> White Label Completo (Sua Marca)</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Servidores Receivers Dedicados</p>
                  <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> IA Dedicada para Classificar</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateLogin('register')}
                className="w-full mt-8 py-3 rounded-lg border border-indigo-950 bg-neutral-950 font-mono text-xs uppercase text-indigo-400 font-bold hover:bg-indigo-950/20 cursor-pointer transition-all"
              >
                Invasão Galáctica
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contato e Solicitar Demonstração */}
      <section id="contato" className="py-24 bg-neutral-900/20 border-t border-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest mb-3">Dúvidas ou Personalização?</h2>
              <h3 className="text-3xl font-extrabold text-white mb-6">Solicite assessoria com nossos arquitetos de monitoramento</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Quer testar a recepção de alarmes com seu próprio painel físico de demonstração? Preencha o cadastro ao lado e receba imediatamente em seu e-mail o token de acesso exclusivo para nossa receptora de teste no IP público.
              </p>

              <div className="space-y-4 text-sm text-neutral-400">
                <p className="flex items-center gap-3"><Mail className="text-emerald-400 w-5 h-5" /> comercial@alienlarm.com</p>
                <p className="flex items-center gap-3"><HelpCircle className="text-emerald-400 w-5 h-5" /> Suporte Técnico via SLA: 2 horas</p>
                <p className="flex items-center gap-2"><Star className="text-yellow-500 w-4 h-4" /> Qualidade Enterprise Recomendada (ISO 27001)</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-emerald-950 bg-neutral-950 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-emerald-400 animate-pulse w-4 h-4" /> SOLICITAR DEMONSTRAÇÃO DO ALIENLARM
              </h4>

              {demoEnviado ? (
                <div className="p-4 rounded-lg bg-emerald-950/50 border border-emerald-500 text-emerald-300 font-mono text-xs">
                  ✔ Solicitação de demonstração recebida! Enviamos o Guia de Conexão ContactID / SIA para seu e-mail de teste.
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={demoNome}
                      onChange={(e) => setDemoNome(e.target.value)}
                      placeholder="Ex: Carlos Albuquerque"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-3 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">E-mail Corporativo</label>
                    <input
                      type="email"
                      required
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="Ex: carlos@portalmonitoramento.com"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-3 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">Anotações do Projeto (Quantidade de Centrais)</label>
                    <textarea
                      rows={3}
                      value={demoMsg}
                      onChange={(e) => setDemoMsg(e.target.value)}
                      placeholder="Gostaria de testar 100 centrais AMT Intelbras no SIA IP..."
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded-lg p-3 text-sm text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    Disparar Solicitação
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Rodape */}
      <footer className="border-t border-emerald-950 bg-neutral-950 text-neutral-500 py-12 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-neutral-400 font-bold">AlienLarm Co. © 2026</span>
            <span className="text-neutral-600">|</span>
            <span>Plataforma SaaS Multi-Tenant Professional</span>
          </div>

          <div className="flex gap-6 text-neutral-400">
            <span className="hover:text-emerald-400 cursor-pointer">Termos de Uso</span>
            <span className="hover:text-emerald-400 cursor-pointer">Política de Privacidade</span>
            <span className="hover:text-emerald-400 cursor-pointer text-emerald-500">Node Receiver Log v4.26</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
