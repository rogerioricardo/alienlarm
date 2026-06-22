import { useState } from 'react';
import { Empresa, Plano } from '../types';
import { Shield, Plus, Building2, ToggleLeft, ToggleRight, Settings2, BarChart3, AlertCircle, Check } from 'lucide-react';

interface MasterAdminViewProps {
  empresas: Empresa[];
  planos: Plano[];
  onAddEmpresa: (nova: Omit<Empresa, 'id' | 'uuid' | 'codigo' | 'criadoEm'>) => void;
  onToggleStatus: (id: number) => void;
  onChangePlano: (id: number, planoId: number) => void;
}

export default function MasterAdminView({ empresas, planos, onAddEmpresa, onToggleStatus, onChangePlano }: MasterAdminViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [nome, setNome] = useState('');
  const [razao, setRazao] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [planoId, setPlanoId] = useState(2); // Enterprise Pro limit
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cnpj) return;
    onAddEmpresa({
      nomeFantasia: nome,
      razaoSocial: razao || nome + " S/A",
      cnpj,
      status: 'Ativa',
      planoId
    });
    setNome('');
    setRazao('');
    setCnpj('');
    setSuccessMsg('Tenant criado com sucesso sob o ID amigável automático!');
    setTimeout(() => setSuccessMsg(''), 3000);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* HUD Cards specific to Master */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Total SaaS Tenancy</span>
            <h4 className="text-2xl font-bold font-mono text-white mt-1">{empresas.length} s</h4>
          </div>
          <Building2 className="text-emerald-500 w-8 h-8 opacity-75" />
        </div>

        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Ativas em Produção</span>
            <h4 className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {empresas.filter(e => e.status === 'Ativa').length}
            </h4>
          </div>
          <Check className="text-emerald-400 w-8 h-8 opacity-75" />
        </div>

        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Faturamento SaaS Previsto</span>
            <h4 className="text-2xl font-bold font-mono text-white mt-1">
              R$ {empresas.reduce((acc, emp) => {
                const p = planos.find(pl => pl.id === emp.planoId);
                return acc + (p?.valor || 0);
              }, 0).toFixed(2)}
            </h4>
          </div>
          <BarChart3 className="text-emerald-500 w-8 h-8 opacity-75" />
        </div>

        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-400">Servidores Receivers Node</span>
            <h4 className="text-2xl font-bold font-mono text-emerald-400 mt-1">04 <span className="text-xs">ON</span></h4>
          </div>
          <Shield className="text-emerald-400 w-8 h-8 animate-pulse" />
        </div>
      </div>

      <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl border border-emerald-950/40">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="text-emerald-500 w-4 h-4" /> Gerenciamento Multitenancy de Empresas
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Crie separações de tenant, suspenda acessos de inadimplentes e configure planos.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded font-mono text-xs uppercase flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Cadastrar Empresa SaaS
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-mono text-xs rounded">
          ✔ {successMsg}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-emerald-950 p-6 rounded-xl space-y-4 max-w-2xl">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold border-b border-emerald-950 pb-2">
            Adicionar Novo Tenant Isolado
          </span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Nome Fantasia da Central</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Delta Segurança Nuvem"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Razão Social</label>
              <input
                type="text"
                required
                value={razao}
                onChange={(e) => setRazao(e.target.value)}
                placeholder="Delta Segurança Eletrônica EIRELI"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">CNPJ da Empresa</label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Plano SaaS Inicial</label>
              <select
                value={planoId}
                onChange={(e) => setPlanoId(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white uppercase font-mono"
              >
                {planos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor.toFixed(2)}/m</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white rounded text-xs uppercase font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded text-xs uppercase font-mono"
            >
              Registrar Nova Empresa
            </button>
          </div>
        </form>
      )}

      {/* Grid of Companies */}
      <div className="bg-neutral-900 border border-emerald-950 rounded-xl overflow-hidden">
        <table className="w-full text-[11px] text-neutral-400 font-mono">
          <thead className="bg-[#050505] p-3 text-neutral-400 uppercase tracking-wider text-left border-b border-emerald-950">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Inscrição Cnpj</th>
              <th className="p-3">Empresa (Tenant)</th>
              <th className="p-3">Plano SaaS</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/20">
            {empresas.map((emp) => {
              const plano = planos.find(p => p.id === emp.planoId);
              return (
                <tr key={emp.id} className="hover:bg-neutral-950/80 transition-colors">
                  <td className="p-3 text-white font-bold">{emp.codigo}</td>
                  <td className="p-3 text-neutral-500">{emp.cnpj}</td>
                  <td className="p-3">
                    <span className="text-white block font-sans font-bold">{emp.nomeFantasia}</span>
                    <span className="text-[9px] text-neutral-500">{emp.razaoSocial}</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    <div className="flex items-center gap-1">
                      <Settings2 className="w-3.5 h-3.5 text-neutral-500" />
                      <select
                        value={emp.planoId}
                        onChange={(e) => onChangePlano(emp.id, Number(e.target.value))}
                        className="bg-transparent border-0 focus:ring-0 focus:outline-none text-[11px] font-bold text-emerald-400 cursor-pointer"
                      >
                        {planos.map(pl => (
                          <option key={pl.id} value={pl.id} className="bg-neutral-900 text-white">{pl.nome}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                      emp.status === 'Ativa'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                        : 'border-red-500/30 text-red-500 bg-red-950/20'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onToggleStatus(emp.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-950 hover:bg-emerald-950 border border-neutral-800 hover:border-emerald-500 text-neutral-400 hover:text-white transition-all text-[10px] uppercase rounded font-bold cursor-pointer"
                    >
                      {emp.status === 'Ativa' ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-400" /> Suspender
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-neutral-500" /> Ativar
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
