import { useState } from 'react';
import { Cliente, Central, Usuario } from '../types';
import { Plus, Users, Cpu, FileText, Check, Landmark, ShieldCheck } from 'lucide-react';

interface CompanyAdminViewProps {
  clientes: Cliente[];
  centrais: Central[];
  usuarios: Usuario[];
  empresaId: number;
  onAddCliente: (novo: Omit<Cliente, 'id' | 'uuid' | 'codigo' | 'empresaId'>) => void;
  onAddCentral: (nova: Omit<Central, 'id' | 'uuid' | 'codigo' | 'empresaId' | 'statusConexao' | 'statusAlarme' | 'ultimoHeartbeat'>) => void;
}

export default function CompanyAdminView({ clientes, centrais, usuarios, empresaId, onAddCliente, onAddCentral }: CompanyAdminViewProps) {
  // Filter data owned by this company only
  const myClientes = clientes.filter(c => c.empresaId === empresaId);
  const myCentrais = centrais.filter(c => c.empresaId === empresaId);
  const myUsuarios = usuarios.filter(u => u.empresaId === empresaId);

  // Form toggles
  const [showCliForm, setShowCliForm] = useState(false);
  const [showCtrForm, setShowCtrForm] = useState(false);

  // Client states
  const [cliNome, setCliNome] = useState('');
  const [cliCpf, setCliCpf] = useState('');
  const [cliEmail, setCliEmail] = useState('');
  const [cliTel, setCliTel] = useState('');
  const [cliRua, setCliRua] = useState('');
  const [cliNum, setCliNum] = useState('');
  const [cliBairro, setCliBairro] = useState('');
  const [cliCidade, setCliCidade] = useState('');
  const [cliEstado, setCliEstado] = useState('SP');
  const [cliCep, setCliCep] = useState('');

  // Central states
  const [ctrCliId, setCtrCliId] = useState(myClientes[0]?.id || 1);
  const [ctrIdent, setCtrIdent] = useState('');
  const [ctrFab, setCtrFab] = useState('Intelbras/Kripton');
  const [ctrMod, setCtrMod] = useState('AN-900 Plus');
  const [ctrProt, setCtrProt] = useState<'ContactID' | 'SIA_DC09' | 'JSON_REST' | 'MQTT'>('ContactID');
  const [ctrConta, setCtrConta] = useState('');

  const [notification, setNotification] = useState('');

  const handleClienteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliNome || !cliCpf) return;
    onAddCliente({
      nome: cliNome,
      cnpjCpf: cliCpf,
      email: cliEmail || 'comercial@cliente.com',
      telefone: cliTel || '119999-0000',
      endereco: {
        rua: cliRua || 'Av. Paulista',
        numero: cliNum || '1000',
        bairro: cliBairro || 'Bela Vista',
        cidade: cliCidade || 'São Paulo',
        estado: cliEstado || 'SP',
        cep: cliCep || '01311-000'
      }
    });

    setCliNome('');
    setCliCpf('');
    setCliEmail('');
    setCliTel('');
    setCliRua('');
    setCliNum('');
    setCliBairro('');
    setCliCidade('');
    setCliCep('');
    setNotification('Cliente cadastrado com sucesso!');
    setTimeout(() => setNotification(''), 3000);
    setShowCliForm(false);
  };

  const handleCentralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctrIdent || !ctrConta) return;
    onAddCentral({
      clienteId: Number(ctrCliId),
      nomeIdentificacao: ctrIdent,
      fabricante: ctrFab,
      modelo: ctrMod,
      protocolo: ctrProt,
      contaPreconfigurada: ctrConta,
      zonas: [
        { numero: 1, nome: "Portão Eletrônico Principal", status: "Normal" },
        { numero: 2, nome: "Sensor de Presença Hall", status: "Normal" },
        { numero: 3, nome: 'Infravermelho Feixe', status: 'Normal' }
      ]
    });

    setCtrIdent('');
    setCtrConta('');
    setNotification('Painel de Central cadastrado com sucesso no Contact Inbound!');
    setTimeout(() => setNotification(''), 3000);
    setShowCtrForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Cards Specific to Tenant Admin */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Clientes Ativos</span>
            <h4 className="text-2xl font-bold font-mono text-white mt-1">{myClientes.length}</h4>
          </div>
          <Users className="text-emerald-500 w-8 h-8 opacity-75" />
        </div>

        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Alarmes Cadastrados</span>
            <h4 className="text-2xl font-bold font-mono text-emerald-400 mt-1">{myCentrais.length}</h4>
          </div>
          <Cpu className="text-emerald-400 w-8 h-8 opacity-75" />
        </div>

        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Usuários da Equipe</span>
            <h4 className="text-2xl font-bold font-mono text-white mt-1">{myUsuarios.length}</h4>
          </div>
          <ShieldCheck className="text-emerald-500 w-8 h-8 opacity-75" />
        </div>

        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Plano Faturamento</span>
            <h4 className="text-2xl font-bold font-mono text-emerald-400 mt-1">EM DIA</h4>
          </div>
          <Landmark className="text-emerald-400 w-8 h-8 opacity-75" />
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-mono text-xs rounded">
          ✔ {notification}
        </div>
      )}

      {/* Forms Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CLI BAR */}
        <div className="bg-neutral-900 p-4 rounded-xl border border-emerald-950/40 flex justify-between items-center">
          <div>
            <span className="text-white text-xs font-bold block uppercase tracking-wider">Módulo de Clientes</span>
            <span className="text-[10px] text-neutral-500">Cadastre proprietários de residências, galpões e comércios.</span>
          </div>
          <button
            onClick={() => { setShowCliForm(!showCliForm); setShowCtrForm(false); }}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold font-mono uppercase rounded flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Cliente
          </button>
        </div>

        {/* CTR BAR */}
        <div className="bg-neutral-900 p-4 rounded-xl border border-emerald-950/40 flex justify-between items-center">
          <div>
            <span className="text-white text-xs font-bold block uppercase tracking-wider">Módulo de Painéis (Centrais)</span>
            <span className="text-[10px] text-neutral-500">Aloque receptores táticos vinculados à conta decodificadora.</span>
          </div>
          <button
            onClick={() => { setShowCtrForm(!showCtrForm); setShowCliForm(false); }}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold font-mono uppercase rounded flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Configurar Central
          </button>
        </div>
      </div>

      {/* CLiente Add Form */}
      {showCliForm && (
        <form onSubmit={handleClienteSubmit} className="bg-neutral-900 border border-emerald-950 p-6 rounded-xl space-y-4">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold border-b border-emerald-950 pb-2">
            Novo Operador/Responsável de Imóvel
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Nome Fantasia / Cliente</label>
              <input
                type="text" required value={cliNome} onChange={e => setCliNome(e.target.value)}
                placeholder="Ex: Auto Posto Estrela"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">CPF / CNPJ</label>
              <input
                type="text" required value={cliCpf} onChange={e => setCliCpf(e.target.value)}
                placeholder="11.222.333/0001-44"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">E-mail Notificação</label>
              <input
                type="email" value={cliEmail} onChange={e => setCliEmail(e.target.value)}
                placeholder="gestao@auto-posto.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Telefone Principal</label>
              <input
                type="text" value={cliTel} onChange={e => setCliTel(e.target.value)}
                placeholder="113455-2233"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Logradouro (Rua/Av)</label>
              <input
                type="text" value={cliRua} onChange={e => setCliRua(e.target.value)}
                placeholder="Rua das Centrais de Rádio"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Número</label>
              <input
                type="text" value={cliNum} onChange={e => setCliNum(e.target.value)}
                placeholder="21-B / 3º Andar"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button" onClick={() => setShowCliForm(false)}
              className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white rounded text-xs uppercase font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded text-xs uppercase font-mono"
            >
              Confirmar Cliente
            </button>
          </div>
        </form>
      )}

      {/* Central Add Form */}
      {showCtrForm && (
        <form onSubmit={handleCentralSubmit} className="bg-neutral-900 border border-emerald-950 p-6 rounded-xl space-y-4">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold border-b border-emerald-950 pb-2">
            Novo Painel de Alarmes Físico/Virtual
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Selecione o Cliente Dono</label>
              <select
                value={ctrCliId} onChange={e => setCtrCliId(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white uppercase font-mono"
              >
                {myClientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.codigo})</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Identificação Amigável da Central</label>
              <input
                type="text" required value={ctrIdent} onChange={e => setCtrIdent(e.target.value)}
                placeholder="Ex: Central Almoxarifado Secundário"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Fabricante</label>
              <input
                type="text" value={ctrFab} onChange={e => setCtrFab(e.target.value)}
                placeholder="Intelbras / DSC"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Modelo do Equipamento</label>
              <input
                type="text" value={ctrMod} onChange={e => setCtrMod(e.target.value)}
                placeholder="AMT-2018 EG"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Protocolo Rx</label>
              <select
                value={ctrProt} onChange={e => setCtrProt(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white font-mono"
              >
                <option value="ContactID">Contact ID (GPRS/IP)</option>
                <option value="SIA_DC09">SIA DC-09 (Criptografado)</option>
                <option value="JSON_REST">HTTP JSON API</option>
                <option value="MQTT">MQTT Broker IoT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Conta (4 dígitos amigáveis)</label>
              <input
                type="text" required maxLength={4} value={ctrConta} onChange={e => setCtrConta(e.target.value.replace(/\D/g, ''))}
                placeholder="5523"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white font-mono text-center tracking-widest text-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button" onClick={() => setShowCtrForm(false)}
              className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white rounded text-xs uppercase font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded text-xs uppercase font-mono"
            >
              Ativar Novo Receptor
            </button>
          </div>
        </form>
      )}

      {/* Lists of current registered entities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients list */}
        <div className="bg-neutral-900 border border-emerald-950 rounded-xl p-5">
          <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="text-emerald-500" /> Relatório de Clientes Proprietários ({myClientes.length})
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {myClientes.map(cli => (
              <div key={cli.id} className="p-3 rounded bg-neutral-950 border border-neutral-800/80 flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-white block font-sans font-bold">{cli.nome}</span>
                  <span className="text-neutral-500 text-[10px] block">{cli.cnpjCpf} - {cli.email}</span>
                  <span className="text-[9px] text-emerald-500 block mt-0.5">{cli.endereco.cidade} / {cli.endereco.estado}</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-bold font-mono">
                  {cli.codigo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Centrais list */}
        <div className="bg-neutral-900 border border-emerald-950 rounded-xl p-5">
          <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
            <Cpu className="text-emerald-500" /> Receptores de Central Configurados ({myCentrais.length})
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {myCentrais.map(ctr => {
              const client = myClientes.find(c => c.id === ctr.clienteId);
              return (
                <div key={ctr.id} className="p-3 rounded bg-neutral-950 border border-neutral-800/80 text-xs font-mono">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-sans font-bold">{ctr.nomeIdentificacao}</span>
                    <span className="text-emerald-400 font-bold bg-neutral-900 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Conta: {ctr.contaPreconfigurada}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <span>{ctr.fabricante} {ctr.modelo} • {ctr.protocolo}</span>
                    <span>Dono: {client ? client.nome : 'Sem dono'}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-950/30 text-[9px]">
                    <span className="text-neutral-500">Último batimento: {ctr.ultimoHeartbeat}</span>
                    <span className={`px-1.5 rounded uppercase font-bold ${
                      ctr.statusAlarme === 'ARMADO' ? 'text-amber-500' : 'text-neutral-400'
                    }`}>
                      STATUS: {ctr.statusAlarme}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
