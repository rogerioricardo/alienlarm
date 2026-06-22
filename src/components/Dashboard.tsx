import { useState, useEffect } from 'react';
import { Usuario, Empresa, Plano, Cliente, Central, Evento, Atendimento, AutomationRule, LogSistema } from '../types';
import {
  INITIAL_EMPRESAS,
  INITIAL_PLANOS,
  INITIAL_USUARIOS,
  INITIAL_CLIENTES,
  INITIAL_CENTRAIS,
  INITIAL_EVENTOS,
  INITIAL_ATENDIMENTOS,
  INITIAL_AUTOMATIONS,
  INITIAL_LOGS
} from '../utils/mockData';

// Subcomponents imports
import MasterAdminView from './MasterAdminView';
import CompanyAdminView from './CompanyAdminView';
import TechnicianView from './TechnicianView';
import OperatorView from './OperatorView';
import ClientPWAView from './ClientPWAView';
import ReceiverSimulator from './ReceiverSimulator';
import AutomationEngine from './AutomationEngine';
import DatabaseSchemaViewer from './DatabaseSchemaViewer';
import ArchitectureDocs from './ArchitectureDocs';

import { 
  ShieldAlert, LayoutDashboard, Terminal, Zap, Layers, BookOpen, 
  CreditCard, LogOut, RefreshCw, Layers3, ToggleLeft, Activity, Users, Cpu, ShieldCheck
} from 'lucide-react';

interface DashboardProps {
  currentUser: Usuario;
  onLogout: () => void;
}

export default function Dashboard({ currentUser, onLogout }: DashboardProps) {
  // Main state - Multi-tenant system simulation
  const [empresas, setEmpresas] = useState<Empresa[]>(INITIAL_EMPRESAS);
  const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTES);
  const [centrais, setCentrais] = useState<Central[]>(INITIAL_CENTRAIS);
  const [eventos, setEventos] = useState<Evento[]>(INITIAL_EVENTOS);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>(INITIAL_ATENDIMENTOS);
  const [regras, setRegras] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [logs, setLogs] = useState<LogSistema[]>(INITIAL_LOGS);

  // Active Contexts
  const [activeUser, setActiveUser] = useState<Usuario>(currentUser);
  
  // Set primary tenant company context based on user profile
  const [activeEmpresaId, setActiveEmpresaId] = useState<number>(
    currentUser.empresaId || INITIAL_EMPRESAS[0].id
  );

  // Shell tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'perfil-role' | 'receiver' | 'automation' | 'finance' | 'database' | 'docs'>('dashboard');

  // Checkout billing states
  const [checkoutPlanoId, setCheckoutPlanoId] = useState<number>(2);
  const [paymentFinished, setPaymentFinished] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Update active empresa ID context if user role switches
  useEffect(() => {
    if (activeUser.empresaId) {
      setActiveEmpresaId(activeUser.empresaId);
    }
  }, [activeUser]);

  // Global action handlers - Master Admin View
  const handleAddEmpresa = (nova: Omit<Empresa, 'id' | 'uuid' | 'codigo' | 'criadoEm'>) => {
    const nextId = empresas.length + 1;
    const codigo = `EMP-00000${nextId}`;
    const formatted: Empresa = {
      ...nova,
      id: nextId,
      uuid: crypto.randomUUID(),
      codigo,
      criadoEm: new Date().toISOString()
    };
    setEmpresas(prev => [...prev, formatted]);
  };

  const handleToggleEmpresaStatus = (id: number) => {
    setEmpresas(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, status: e.status === 'Ativa' ? 'Suspensa' : 'Ativa' };
      }
      return e;
    }));
  };

  const handleChangeEmpresaPlano = (empId: number, planoId: number) => {
    setEmpresas(prev => prev.map(e => {
      if (e.id === empId) {
        return { ...e, planoId };
      }
      return e;
    }));
  };

  // Global action handlers - Company Admin View
  const handleAddCliente = (novo: Omit<Cliente, 'id' | 'uuid' | 'codigo' | 'empresaId'>) => {
    const nextId = clientes.length + 1;
    const codigo = `CLI-00000${nextId}`;
    const formatted: Cliente = {
      ...novo,
      id: nextId,
      uuid: crypto.randomUUID(),
      codigo,
      empresaId: activeEmpresaId
    };
    setClientes(prev => [...prev, formatted]);
  };

  const handleAddCentral = (nova: Omit<Central, 'id' | 'uuid' | 'codigo' | 'empresaId' | 'statusConexao' | 'statusAlarme' | 'ultimoHeartbeat'>) => {
    const nextId = centrais.length + 1;
    const codigo = `CTR-00000${nextId}`;
    const formatted: Central = {
      ...nova,
      id: nextId,
      uuid: crypto.randomUUID(),
      codigo,
      empresaId: activeEmpresaId,
      statusConexao: 'ONLINE',
      statusAlarme: 'DESARMADO',
      ultimoHeartbeat: new Date().toISOString()
    };
    setCentrais(prev => [...prev, formatted]);
  };

  // Global action handlers - Installer Technician
  const handleUpdateZonas = (centralId: number, zonas: { numero: number; nome: string; status: 'Normal' | 'Aberta' | 'Violada' }[]) => {
    setCentrais(prev => prev.map(c => {
      if (c.id === centralId) {
        // Evaluate overall panel status if any zone is Tripped (Violada)
        const isViolated = zonas.some(z => z.status === 'Violada');
        return {
          ...c,
          zonas,
          statusAlarme: isViolated ? 'DISPARADO' : c.statusAlarme
        };
      }
      return c;
    }));

    // If any is Violated (Violada) - dispatch instant alarm event
    const central = centrais.find(c => c.id === centralId);
    const hasViolated = zonas.find(z => z.status === 'Violada');
    if (central && hasViolated) {
      handleTriggerRawEvent({
        centralId: central.id,
        empresaId: central.empresaId,
        codigoEvento: '1134', // burglary burglar alarm
        descricao: `Disparo automático - Intrusão detectada em ${hasViolated.nome}`,
        criticidade: 'CRITICA',
        origemPacote: `[${central.contaPreconfigurada} 18 1 1134 01 00${hasViolated.numero}]`
      });
    }
  };

  // Global action handlers - Operator Treatment
  const handleTratarEvento = (eventoId: number, statusTratamento: 'PENDENTE' | 'EM_TRATAMENTO' | 'RESOLVIDO') => {
    setEventos(prev => prev.map(e => {
      if (e.id === eventoId) {
        return { ...e, statusTratamento };
      }
      return e;
    }));

    // Logs the auditoria
    handleAddSystemLog({
      tipo: 'AUDITORIA',
      descricao: `Operador Bauma tratou evento EVT-00${eventoId} para o estado: ${statusTratamento}`
    });
  };

  const handleAddAtendimentoNota = (eventoId: number, nota: string) => {
    setAtendimentos(prev => prev.map(atd => {
      if (atd.eventoId === eventoId) {
        return { ...atd, anotacoes: [...atd.anotacoes, nota] };
      }
      return atd;
    }));
  };

  // Global action handlers - Client PWA Mobile
  const handleToggleArmCentral = (centralId: number, statusAlarme: 'DESARMADO' | 'ARMADO' | 'DISPARADO') => {
    setCentrais(prev => prev.map(c => {
      if (c.id === centralId) {
        return { ...c, statusAlarme };
      }
      return c;
    }));

    const central = centrais.find(c => c.id === centralId);
    if (central) {
      // Create alarm log event
      const eventCode = statusAlarme === 'ARMADO' ? '3401' : '1401';
      handleTriggerRawEvent({
        centralId: central.id,
        empresaId: central.empresaId,
        codigoEvento: eventCode,
        descricao: `Painel central transicionado via comando remoto móvel para: ${statusAlarme}`,
        criticidade: 'BAIXA',
        origemPacote: `SIA #${central.contaPreconfigurada} L0 ${eventCode === '3401' ? 'AR' : 'OP'}00`
      });
    }
  };

  // Core Receiver event trigger engine (triggers automation + operator queues)
  const handleTriggerRawEvent = (novo: Omit<Evento, 'id' | 'uuid' | 'codigo' | 'dataHora' | 'statusTratamento'>) => {
    const nextId = eventos.length + 1;
    const codigo = `EVT-00000${nextId}`;
    const formatted: Evento = {
      ...novo,
      id: nextId,
      uuid: crypto.randomUUID(),
      codigo,
      dataHora: new Date().toISOString(),
      statusTratamento: 'PENDENTE'
    };

    setEventos(prev => [formatted, ...prev]);

    // Perform check for automation rules matching this event code
    const matchedRule = regras.find(rule => rule.ativo && rule.empresaId === novo.empresaId);
    if (matchedRule) {
      handleAddSystemLog({
        tipo: 'SISTEMA',
        descricao: `Engine Automação ativada ruidosamente para regra: '${matchedRule.nome}'`
      });
    }
  };

  const handleAddSystemLog = (log: { tipo: 'RECEIVER' | 'SISTEMA' | 'AUDITORIA' | 'LOGIN'; descricao: string }) => {
    const formatted: LogSistema = {
      id: logs.length + 1,
      dataHora: new Date().toISOString(),
      tipo: log.tipo,
      usuario: activeUser.nome,
      ip: '177.228.12.80',
      descricao: log.descricao
    };
    setLogs(prev => [formatted, ...prev]);
  };

  // Rule Builders
  const handleToggleAutomationRule = (id: number) => {
    setRegras(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, ativo: !r.ativo };
      }
      return r;
    }));
  };

  const handleAddAutomationRule = (rule: Omit<AutomationRule, 'id' | 'empresaId'>) => {
    const formatted: AutomationRule = {
      ...rule,
      id: regras.length + 1,
      empresaId: activeEmpresaId
    };
    setRegras(prev => [...prev, formatted]);
  };

  // Billing gateway simulations
  const activeEmpresa = empresas.find(e => e.id === activeEmpresaId) || empresas[0];
  const activePlano = INITIAL_PLANOS.find(p => p.id === activeEmpresa.planoId) || INITIAL_PLANOS[1];

  const triggerPaymentSimulation = () => {
    setPaymentFinished(true);
    setTimeout(() => {
      handleChangeEmpresaPlano(activeEmpresaId, checkoutPlanoId);
      setPaymentFinished(false);
      alert('Plano de Licenciamento SaaS atualizado com sucesso no MercadoPago Gateway! Sua central receptora agora possui maior cota de equipamentos.');
    }, 2800);
  };

  return (
    <div id="dashboard_root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-black">
      {/* Absolute futuristic decoration */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />

      {/* Top Context Configuration HUD */}
      <section className="bg-neutral-900 border-b border-emerald-950/40 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-950 border border-emerald-500/40 rounded flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold block text-white uppercase font-mono tracking-wider">
                AlienLarm SaaS HUD Monitor
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                Multitenancy: CONECTADO // Licença Pro Ativa
              </span>
            </div>
          </div>

          {/* Quick profile / tenant override controls which are exceptional for demonstrating features instantly */}
          <div className="flex flex-wrap items-center gap-3 bg-neutral-950 p-2 border border-emerald-950/30 rounded-lg">
            
            {/* Tenant switcher */}
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-neutral-500 uppercase font-mono">Empresa Ativa:</span>
              <select
                value={activeEmpresaId}
                onChange={(e) => setActiveEmpresaId(Number(e.target.value))}
                className="bg-neutral-900 border-0 focus:ring-0 text-[10px] font-bold text-emerald-400 font-mono focus:outline-none uppercase cursor-pointer"
              >
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nomeFantasia} ({emp.codigo})</option>
                ))}
              </select>
            </div>

            <span className="text-emerald-950">|</span>

            {/* Profile Override switcher */}
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-neutral-500 uppercase font-mono">Simular Cargo:</span>
              <select
                value={activeUser.funcao}
                onChange={(e) => {
                  const selectedRole = e.target.value as any;
                  // Map matching test mock user
                  const match = INITIAL_USUARIOS.find(u => u.funcao === selectedRole);
                  if (match) {
                    setActiveUser(match);
                  } else {
                    setActiveUser({
                      ...activeUser,
                      funcao: selectedRole
                    });
                  }
                }}
                className="bg-neutral-900 border-0 focus:ring-0 text-[10px] font-bold text-emerald-400 font-mono focus:outline-none cursor-pointer"
              >
                <option value="MASTER">Master Admin (Global)</option>
                <option value="ADMIN">Empresa Admin (Financeiro/CAD)</option>
                <option value="TECNICO">Técnico Instalador (Workbench/Zonas)</option>
                <option value="OPERADOR">Operador Central (Treat Alerts)</option>
                <option value="CLIENTE">Cliente (PWA view)</option>
              </select>
            </div>

            <span className="text-emerald-950">|</span>

            {/* User display */}
            <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 pr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeUser.nome} ({activeUser.funcao})
            </div>
          </div>
        </div>
      </section>

      {/* Main workspace layer */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side menu */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-widest pl-2 mb-2">Painéis de Controle</span>
            
            <nav className="space-y-1 text-sm font-medium text-neutral-400 font-mono">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Geral Telemetria
              </button>

              <button
                onClick={() => setActiveTab('perfil-role')}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'perfil-role' ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" /> Visão de Perfil: {activeUser.funcao}
              </button>

              <button
                onClick={() => setActiveTab('receiver')}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'receiver' ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4" /> Simulador Receiver
              </button>

              <button
                onClick={() => setActiveTab('automation')}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'automation' ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" /> Engine Automatizador
              </button>

              <button
                onClick={() => setActiveTab('finance')}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'finance' ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Mensalidades & MP
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'database' ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" /> Tabelas SQL Schema
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'docs' ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Manual do Arquiteto
              </button>
            </nav>
          </div>

          {/* Quick exit bar */}
          <button
            onClick={onLogout}
            className="w-full p-3 font-mono text-xs uppercase tracking-wide border border-red-950/50 rounded-lg hover:border-red-500 bg-red-950/5 hover:bg-red-950/20 text-red-400 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Deslogar do SaaS
          </button>
        </aside>

        {/* Workspace body */}
        <main className="lg:col-span-9 space-y-6">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Core general dashboard overview metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-neutral-900 border border-emerald-950/40 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-neutral-400">Tempo de Atividade</span>
                    <h4 className="text-xl font-bold font-mono text-emerald-400 mt-1">99.998%</h4>
                  </div>
                  <Cpu className="text-emerald-500 w-8 h-8 opacity-75" />
                </div>

                <div className="bg-neutral-900 border border-emerald-950/40 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-neutral-400">Centrais Desarmadas</span>
                    <h4 className="text-xl font-bold font-mono text-white mt-1">
                      {centrais.filter(c => c.statusAlarme === 'DESARMADO' && c.empresaId === activeEmpresaId).length}
                    </h4>
                  </div>
                  <ShieldCheck className="text-emerald-500 w-8 h-8 opacity-75" />
                </div>

                <div className="bg-neutral-900 border border-emerald-950/40 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-neutral-400">Centrais Armadas</span>
                    <h4 className="text-xl font-bold font-mono text-amber-500 mt-1">
                      {centrais.filter(c => c.statusAlarme === 'ARMADO' && c.empresaId === activeEmpresaId).length}
                    </h4>
                  </div>
                  <ShieldCheck className="text-amber-500 w-8 h-8 opacity-75 animate-pulse" />
                </div>

                <div className="bg-neutral-900 border border-emerald-950/40 p-4 rounded-xl flex items-center justify-between col-span-1 border-red-950 bg-red-950/5">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-red-400 block font-bold">Zonas em Disparo</span>
                    <h4 className="text-xl font-bold font-mono text-red-500 mt-1">
                      {centrais.filter(c => c.statusAlarme === 'DISPARADO' && c.empresaId === activeEmpresaId).length} DISP
                    </h4>
                  </div>
                  <ShieldAlert className="text-red-500 w-8 h-8 opacity-75 animate-bounce" />
                </div>
              </div>

              {/* General Events list & Receiver metrics split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Active signals console */}
                <div className="bg-neutral-900 border border-emerald-950 rounded-xl p-5">
                  <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="text-emerald-500" /> Histórico Multi-Tenant de Sinais Decodificados
                  </h4>
                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {eventos.map(evt => (
                      <div key={evt.id} className="p-3 rounded bg-neutral-950 border border-neutral-800/80 text-xs font-mono">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-bold">{evt.descricao}</span>
                          <span className={`px-1 rounded text-[8px] uppercase font-bold border ${
                            evt.criticidade === 'CRITICA' ? 'border-red-500/30 text-red-500 bg-red-950/15' : 'border-neutral-800 text-neutral-500'
                          }`}>
                            {evt.criticidade}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-neutral-500">
                          <span>Pacote: {evt.origemPacote}</span>
                          <span>{evt.dataHora.split('T')[1].substring(0, 8)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Receiver system logs console */}
                <div className="bg-neutral-900 border border-emerald-950 rounded-xl p-5">
                  <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Terminal className="text-emerald-500" /> Logs Rápidos do Receiver (Node.js Daemon)
                  </h4>
                  <div className="space-y-2.5 bg-black rounded-lg p-4 max-h-[350px] overflow-y-auto pr-2 text-emerald-400 font-mono text-[10px]">
                    {logs.map((log) => (
                      <div key={log.id} className="border-b border-emerald-950/30 pb-1.5 last:border-0">
                        <div className="flex justify-between text-[9px] text-neutral-500">
                          <span>{log.dataHora.substring(11, 19)} - {log.tipo}</span>
                          <span>IP: {log.ip}</span>
                        </div>
                        <p className="mt-0.5 text-neutral-300">{log.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'perfil-role' && (
            <div>
              {activeUser.funcao === 'MASTER' && (
                <MasterAdminView
                  empresas={empresas}
                  planos={INITIAL_PLANOS}
                  onAddEmpresa={handleAddEmpresa}
                  onToggleStatus={handleToggleEmpresaStatus}
                  onChangePlano={handleChangeEmpresaPlano}
                />
              )}

              {activeUser.funcao === 'ADMIN' && (
                <CompanyAdminView
                  clientes={clientes}
                  centrais={centrais}
                  usuarios={usuarios}
                  empresaId={activeEmpresaId}
                  onAddCliente={handleAddCliente}
                  onAddCentral={handleAddCentral}
                />
              )}

              {activeUser.funcao === 'TECNICO' && (
                <TechnicianView
                  centrais={centrais}
                  empresaId={activeEmpresaId}
                  onUpdateZonas={handleUpdateZonas}
                />
              )}

              {activeUser.funcao === 'OPERADOR' && (
                <OperatorView
                  eventos={eventos}
                  clientes={clientes}
                  centrais={centrais}
                  usuarios={usuarios}
                  empresaId={activeEmpresaId}
                  onTratarEvento={handleTratarEvento}
                  onAddAtendimentoNota={handleAddAtendimentoNota}
                />
              )}

              {activeUser.funcao === 'CLIENTE' && (
                <ClientPWAView
                  centrais={centrais}
                  eventos={eventos}
                  empresaId={activeEmpresaId}
                  onToggleArm={handleToggleArmCentral}
                />
              )}
            </div>
          )}

          {activeTab === 'receiver' && (
            <ReceiverSimulator
              centrais={centrais}
              onTriggerEvent={handleTriggerRawEvent}
              onAddLog={handleAddSystemLog}
            />
          )}

          {activeTab === 'automation' && (
            <AutomationEngine
              regras={regras}
              onToggleRule={handleToggleAutomationRule}
              onAddRule={handleAddAutomationRule}
            />
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6 font-sans">
              <div className="bg-neutral-900 border border-emerald-950 p-5 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="text-emerald-500 w-4.5 h-4.5" /> Mensalidades SaaS & Mercado Pago Gateway
                </h3>
                <p className="text-xs text-neutral-400">
                  Gerencie a assinatura ativa da sua empresa monitoradora. Caso exceda o limite de centrais contratadas, atualize o plano imediatamente.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Checkout card */}
                <div className="bg-neutral-900 border border-emerald-950 p-6 rounded-xl space-y-4">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold block border-b border-emerald-950 pb-2">
                    Upgrade / Renovação com Mercado Pago API
                  </span>

                  <div className="space-y-3">
                    <label className="block text-xs font-mono text-neutral-400 uppercase">Selecione o Plano de Upgrade</label>
                    <select
                      value={checkoutPlanoId}
                      onChange={(e) => setCheckoutPlanoId(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white uppercase font-mono"
                    >
                      {INITIAL_PLANOS.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor.toFixed(2)}/m</option>
                      ))}
                    </select>
                  </div>

                  {/* Coupon builder */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-neutral-400 uppercase">Cupom de Desconto</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Ex: ALIENLARM20"
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white font-mono uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (coupon.toUpperCase() === 'ALIENLARM20') {
                            setCouponApplied(true);
                            alert('Cupom ALIENLARM20 aplicado! 20% de desconto adicional no ciclo anual da licença.');
                          } else {
                            alert('Código do cupom inválido.');
                          }
                        }}
                        className="px-3.5 py-1.5 border border-neutral-800 text-neutral-300 hover:text-white rounded text-xs font-mono"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  {/* Pricing list layout */}
                  <div className="p-4 bg-neutral-950 border border-emerald-950/40 rounded space-y-1.5 text-xs font-mono text-neutral-300">
                    <div className="flex justify-between">
                      <span>Valor Base:</span>
                      <span>R$ {(INITIAL_PLANOS.find(p => p.id === checkoutPlanoId)?.valor || 0).toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Desconto Cupom (20%):</span>
                        <span>- R$ {((INITIAL_PLANOS.find(p => p.id === checkoutPlanoId)?.valor || 0) * 0.2).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold border-t border-emerald-950/40 pt-1.5 mt-1.5">
                      <span>Total de Cobrança:</span>
                      <span>R$ {((INITIAL_PLANOS.find(p => p.id === checkoutPlanoId)?.valor || 0) * (couponApplied ? 0.8 : 1)).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Fake checkout button */}
                  <button
                    onClick={triggerPaymentSimulation}
                    disabled={paymentFinished}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider font-mono text-xs rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {paymentFinished ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Processando Pix/Mercado Pago...
                      </>
                    ) : (
                      <>
                        Confirmar Pagamento Seguro
                      </>
                    )}
                  </button>
                </div>

                {/* Subscriptions catalog */}
                <div className="bg-neutral-900 border border-emerald-950 p-6 rounded-xl space-y-4">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-bold block border-b border-emerald-950 pb-2">
                    Assinatura do Tenant Ativo
                  </span>

                  <div className="space-y-3.5 text-xs text-neutral-300">
                    <p><strong>Empresa monitorada:</strong> <span className="text-white font-mono">{activeEmpresa.nomeFantasia}</span></p>
                    <p><strong>Plano atual:</strong> <span className="text-emerald-400 font-bold uppercase font-mono">{activePlano.nome}</span></p>
                    <p><strong>Cota utilizada:</strong> <span className="font-mono">{centrais.filter(c => c.empresaId === activeEmpresaId).length} / {activePlano.limiteCentrais} centrais</span></p>
                    <div className="h-2 bg-neutral-950 rounded border border-emerald-950 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${Math.min(100, (centrais.filter(c => c.empresaId === activeEmpresaId).length / activePlano.limiteCentrais) * 100)}%` }}
                      />
                    </div>
                    <p><strong>Status financeiro:</strong> <span className="text-emerald-400 font-bold uppercase font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/20">Pago - Adimplente</span></p>
                    <p><strong>Vencimento recorrente:</strong> <span className="font-mono">2026-07-22</span></p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'database' && <DatabaseSchemaViewer />}

          {activeTab === 'docs' && <ArchitectureDocs />}

        </main>
      </div>
    </div>
  );
}
