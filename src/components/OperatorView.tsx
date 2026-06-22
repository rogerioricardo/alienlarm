import { useState } from 'react';
import { Evento, Atendimento, Cliente, Central, Usuario } from '../types';
import { ShieldAlert, AlertOctagon, Bell, Clock, MapPin, Phone, CheckSquare, MessageSquare, ChevronRight, CheckCircle } from 'lucide-react';

interface OperatorViewProps {
  eventos: Evento[];
  clientes: Cliente[];
  centrais: Central[];
  usuarios: Usuario[];
  empresaId: number;
  onTratarEvento: (eventoId: number, status: 'PENDENTE' | 'EM_TRATAMENTO' | 'RESOLVIDO') => void;
  onAddAtendimentoNota: (eventoId: number, nota: string) => void;
}

export default function OperatorView({ eventos, clientes, centrais, usuarios, empresaId, onTratarEvento, onAddAtendimentoNota }: OperatorViewProps) {
  // Only events and centrais of this company
  const myCentrais = centrais.filter(c => c.empresaId === empresaId);
  const myEventos = eventos.filter(e => e.empresaId === empresaId);

  const [selectedEvtId, setSelectedEvtId] = useState<number | null>(myEventos[0]?.id || null);
  const activeEvento = myEventos.find(e => e.id === selectedEvtId);
  const activeCentral = activeEvento ? myCentrais.find(c => c.id === activeEvento.centralId) : null;
  const activeCliente = activeCentral ? clientes.find(c => c.id === activeCentral.clienteId) : null;

  // Checklist states
  const [chkPhone, setChkPhone] = useState(false);
  const [chkFalse, setChkFalse] = useState(false);
  const [chkDispatch, setChkDispatch] = useState(false);
  const [novaNota, setNovaNota] = useState('');

  const [acting, setActing] = useState(false);

  const handleResolve = () => {
    if (!activeEvento) return;
    onTratarEvento(activeEvento.id, 'RESOLVIDO');
    setSelectedEvtId(null);
    setChkPhone(false);
    setChkFalse(false);
    setChkDispatch(false);
  };

  const handleStartTreatment = () => {
    if (!activeEvento) return;
    onTratarEvento(activeEvento.id, 'EM_TRATAMENTO');
  };

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvento || !novaNota) return;
    onAddAtendimentoNota(activeEvento.id, novaNota);
    setNovaNota('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Col 1: Queue of active signals */}
      <div className="lg:col-span-4 bg-neutral-900 border border-emerald-950 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-emerald-950 pb-2">
          <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="text-red-500 w-4.5 h-4.5 animate-bounce" /> Painel de Eventos em Escuta
          </h4>
          <span className="text-[9px] bg-red-950/40 text-red-400 px-2 py-0.5 rounded border border-red-500/20 uppercase font-mono font-bold">
            {myEventos.filter(e => e.statusTratamento !== 'RESOLVIDO').length} Pendentes
          </span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {myEventos.map(evt => {
            const ctr = myCentrais.find(c => c.id === evt.centralId);
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEvtId(evt.id)}
                className={`p-3 rounded border text-xs font-mono cursor-pointer transition-all ${
                  selectedEvtId === evt.id 
                    ? 'bg-neutral-950 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.15)] text-white' 
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold border ${
                    evt.criticidade === 'CRITICA' ? 'border-red-500/30 text-red-400 bg-red-950/20' :
                    evt.criticidade === 'ALTA' ? 'border-amber-500/30 text-amber-400 bg-amber-950/20' :
                    'border-neutral-700 text-neutral-400 bg-neutral-900'
                  }`}>
                    {evt.criticidade}
                  </span>
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 2026-06-22
                  </span>
                </div>

                <div className="font-bold text-neutral-100 uppercase tracking-tight line-clamp-1">
                  {evt.descricao}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Receptor: {ctr ? ctr.nomeIdentificacao : 'Central Independente'} ({evt.codigo})
                </div>

                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-emerald-950/30 text-[9px]">
                  <span className="text-neutral-500">RAW: {evt.origemPacote}</span>
                  <span className={`font-bold ${
                    evt.statusTratamento === 'RESOLVIDO' ? 'text-emerald-400' :
                    evt.statusTratamento === 'EM_TRATAMENTO' ? 'text-indigo-400 animate-pulse' :
                    'text-red-400'
                  }`}>
                    {evt.statusTratamento}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Col 2: Event remediation area */}
      <div className="lg:col-span-8 bg-neutral-900 border border-emerald-950 rounded-xl p-6 relative overflow-hidden">
        {activeEvento ? (
          <div className="space-y-6">
            
            {/* Alert bar header */}
            <div className={`p-4 rounded-xl border flex items-center gap-3.5 mb-4 ${
              activeEvento.criticidade === 'CRITICA'
                ? 'bg-red-950/15 border-red-500/30 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                : 'bg-neutral-950 border-neutral-800 text-neutral-300'
            }`}>
              <AlertOctagon className={`w-9 h-9 shrink-0 ${activeEvento.criticidade === 'CRITICA' ? 'text-red-500 animate-bounce' : 'text-amber-500'}`} />
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest block text-neutral-400">CRÍTICA DE MONITORAMENTO ATIVA</span>
                <h4 className="text-base font-extrabold font-mono text-white leading-tight uppercase">{activeEvento.descricao}</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Disparado em: {activeEvento.dataHora} // Pacote: {activeEvento.origemPacote}</p>
              </div>
            </div>

            {/* Quick treatment action bar */}
            {activeEvento.statusTratamento === 'PENDENTE' ? (
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-xs space-y-3">
                <p className="text-neutral-400">Este evento ainda não foi assinado ou iniciado por um humano. Deseja assumir o atendimento?</p>
                <button
                  onClick={handleStartTreatment}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs uppercase font-bold rounded cursor-pointer transition-all inline-flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" /> Assumir Ocorrência
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Contact data of property */}
                <div className="md:col-span-6 space-y-4">
                  <h5 className="text-white text-xs font-bold uppercase tracking-wider font-mono border-b border-emerald-950 pb-1.5">
                    Dados do Local Protegido
                  </h5>
                  {activeCliente ? (
                    <div className="space-y-3 text-xs text-neutral-300 font-sans">
                      <div>
                        <span className="text-neutral-500 font-mono block text-[10px] uppercase">Razão Proprietário</span>
                        <span className="font-bold text-white uppercase">{activeCliente.nome}</span>
                      </div>
                      <div className="flex gap-2 items-start text-neutral-400">
                        <MapPin className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-white font-sans">{activeCliente.endereco.rua}, {activeCliente.endereco.numero}</span>
                          <span className="block text-[10px] text-neutral-500 font-mono">{activeCliente.endereco.bairro} - {activeCliente.endereco.cidade} / {activeCliente.endereco.estado}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center text-emerald-300 font-mono mt-1">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold">{activeCliente.telefone}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500">Sem dados cadastrados do imóvel receptor.</span>
                  )}

                  {/* Checklist check list */}
                  <div className="pt-2">
                    <h5 className="text-white text-xs font-bold uppercase tracking-wider font-mono border-b border-emerald-950 pb-1.5 mb-2.5">
                      Procedimento Operacional de Emergência
                    </h5>
                    <div className="space-y-2 text-xs font-mono text-neutral-300">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox" checked={chkPhone} onChange={e => setChkPhone(e.target.checked)}
                          className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-950 accent-emerald-500"
                        />
                        Efetuar ligação de verificação (Contato de Senha/Contra-senha)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox" checked={chkFalse} onChange={e => setChkFalse(e.target.checked)}
                          className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-950 accent-emerald-500"
                        />
                        Confirmar se é falso disparo pelo painel da câmera
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox" checked={chkDispatch} onChange={e => setChkDispatch(e.target.checked)}
                          className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-950 accent-emerald-500"
                        />
                        Despachar viatura de apoio tático ou serviços públicos
                      </label>
                    </div>
                  </div>
                </div>

                {/* Treatment notations */}
                <div className="md:col-span-6 space-y-4">
                  <h5 className="text-white text-xs font-bold uppercase tracking-wider font-mono border-b border-emerald-950 pb-1.5">
                    Histórico de Operações
                  </h5>

                  <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 font-mono text-[10px] text-neutral-300">
                    <p className="border-b border-emerald-950/20 pb-1 text-emerald-400">
                      [INFO] Canal de atendimento iniciado pela Barbosa às 15:28:40.
                    </p>
                    <p className="text-neutral-400">// As anotações adicionadas são salvas com chave estrangeira na tabela de atendimentos.</p>
                  </div>

                  {/* Add notation form */}
                  <form onSubmit={handleAddAnnotation} className="pt-1.5">
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Inserir Nota ao Log de Auditoria</label>
                    <div className="flex gap-2">
                      <input
                        type="text" required value={novaNota} onChange={e => setNovaNota(e.target.value)}
                        placeholder="Ex: Deixou mensagem na caixa postal do cliente..."
                        className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 focus:outline-none rounded p-2 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs uppercase font-bold rounded cursor-pointer"
                      >
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* Resolve button area */}
            {activeEvento.statusTratamento === 'EM_TRATAMENTO' && (
              <div className="pt-4 border-t border-emerald-950/60 flex justify-between items-center">
                <span className="text-[10px] font-mono text-neutral-500">
                  Certifique-se de marcar o checklist operacional antes de dar baixa no evento.
                </span>
                <button
                  onClick={handleResolve}
                  disabled={!chkPhone}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wide rounded-lg flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle className="w-4 h-4" /> Finalizar Atendimento (Baixa)
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center text-neutral-500 select-none">
            <CheckSquare className="w-16 h-16 text-emerald-950 mb-3 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">Monitor Limpo - Nenhuma Ocorrência Ativa</span>
            <p className="text-xs text-neutral-600 max-w-sm mt-1">Escolha um item da listagem ao lado para iniciar as ações de contenção e auditoria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
