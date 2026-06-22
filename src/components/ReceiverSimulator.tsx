import { useState } from 'react';
import { Central, Evento } from '../types';
import { Terminal, Send, Server, Play, ShieldAlert, Cpu, Heart, CheckCircle } from 'lucide-react';

interface ReceiverSimulatorProps {
  centrais: Central[];
  onTriggerEvent: (evento: Omit<Evento, 'id' | 'uuid' | 'codigo' | 'dataHora' | 'statusTratamento'>) => void;
  onAddLog: (log: { tipo: 'RECEIVER' | 'SISTEMA' | 'AUDITORIA' | 'LOGIN'; descricao: string }) => void;
}

export default function ReceiverSimulator({ centrais, onTriggerEvent, onAddLog }: ReceiverSimulatorProps) {
  const [protocol, setProtocol] = useState<'ContactID' | 'SIA_DC09'>('ContactID');
  
  // Selection builders
  const [selectedCentralId, setSelectedCentralId] = useState(centrais[0]?.id || 1);
  const activeCentral = centrais.find(c => c.id === selectedCentralId);

  // Alarm types
  const EVENTO_OPCOES = [
    { codigo: "1130", desc: "Disparo de Incêndio / Lab", criticidade: "CRITICA" as const },
    { codigo: "1121", desc: "Pânico Silencioso / Coação", criticidade: "CRITICA" as const },
    { codigo: "1134", desc: "Arrombamento / Entrada Não Autorizada", criticidade: "ALTA" as const },
    { codigo: "1301", desc: "Queda de Rede Elétrica AC principal", criticidade: "MEDIA" as const },
    { codigo: "3401", desc: "Central Armada (Lock/Fechado)", criticidade: "BAIXA" as const },
    { codigo: "1401", desc: "Central Desarmada (Unlock/Aberto)", criticidade: "BAIXA" as const },
  ];
  const [selectedEvtIdx, setSelectedEvtIdx] = useState(0);

  // Live simulation log
  const [eventsFiredLog, setEventsFiredLog] = useState<{ id: number; timestamp: string; raw: string; parsed: string }[]>([]);
  const [heartbeatActive, setHeartbeatActive] = useState(true);

  const handleTransmit = () => {
    if (!activeCentral) return;
    const evt = EVENTO_OPCOES[selectedEvtIdx];
    
    // Construct Raw Package based on protocol selection
    let rawPackage = '';
    if (protocol === 'ContactID') {
      // Format: [ACCT 18 1 EVT ZN USR] (Contact ID format)
      rawPackage = `[${activeCentral.contaPreconfigurada} 18 1 ${evt.codigo} 01 003]`;
    } else {
      // Format: SIA DC-09 style
      rawPackage = `SIA #${activeCentral.contaPreconfigurada} L0 ${evt.codigo === '1121' ? 'PA01' : evt.codigo === '1130' ? 'FA03' : 'AR01'}`;
    }

    // Call state action to trigger on main queue
    onTriggerEvent({
      centralId: activeCentral.id,
      empresaId: activeCentral.empresaId,
      codigoEvento: evt.codigo,
      descricao: `${evt.desc} (Simulado via Workbench)`,
      criticidade: evt.criticidade,
      origemPacote: rawPackage
    });

    // Add to Receiver System Logs
    onAddLog({
      tipo: 'RECEIVER',
      descricao: `Pacote decodificado da central ${activeCentral.contaPreconfigurada} [${protocol}]: '${rawPackage}'`
    });

    const timestamp = new Date().toLocaleTimeString();
    setEventsFiredLog(prev => [
      {
        id: Date.now(),
        timestamp,
        raw: rawPackage,
        parsed: `Central: ${activeCentral.nomeIdentificacao} -> ${evt.desc} (${evt.criticidade})`
      },
      ...prev
    ]);
  };

  const handleSimulateHeartbeat = () => {
    if (!activeCentral) return;
    onAddLog({
      tipo: 'RECEIVER',
      descricao: `Heartbeat ping (Polling SIA/ContactID) recebido da conta ${activeCentral.contaPreconfigurada} vindo do IP reservado.`
    });
    alert(`Mensagem Polling (HEARTBEAT) injetada com sucesso no canal de telemetria da central ${activeCentral.contaPreconfigurada}.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Simulation controller */}
      <div className="lg:col-span-5 bg-neutral-900 border border-emerald-950 rounded-xl p-5 space-y-4">
        <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950 pb-2">
          <Cpu className="text-emerald-500 w-4.5 h-4.5" /> Simulador de Sinais Físicos de Centrais
        </h4>

        {centrais.length === 0 ? (
          <span className="text-xs text-neutral-500 block">Nenhuma central de alarme cadastrada para simulação.</span>
        ) : (
          <div className="space-y-4 text-xs font-mono">
            
            {/* Protocol */}
            <div>
              <label className="block text-neutral-400 uppercase mb-1.5 font-bold">1. Escolha o Protocolo Transmissor</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button" onClick={() => setProtocol('ContactID')}
                  className={`py-2 border text-center rounded uppercase font-bold text-[10px] cursor-pointer transition-all ${
                    protocol === 'ContactID' 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500' 
                      : 'border-neutral-800 text-neutral-500 hover:text-neutral-400'
                  }`}
                >
                  Contact ID (Standard)
                </button>
                <button
                  type="button" onClick={() => setProtocol('SIA_DC09')}
                  className={`py-2 border text-center rounded uppercase font-bold text-[10px] cursor-pointer transition-all ${
                    protocol === 'SIA_DC09' 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500' 
                      : 'border-neutral-800 text-neutral-500 hover:text-neutral-400'
                  }`}
                >
                  SIA DC-09 (IP)
                </button>
              </div>
            </div>

            {/* Central */}
            <div>
              <label className="block text-neutral-400 uppercase mb-1.5 font-bold">2. Selecione a Central Emissora</label>
              <select
                value={selectedCentralId} onChange={e => setSelectedCentralId(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-white font-mono uppercase text-xs"
              >
                {centrais.map(c => (
                  <option key={c.id} value={c.id}>{c.nomeIdentificacao} (Conta: {c.contaPreconfigurada})</option>
                ))}
              </select>
            </div>

            {/* Event code list */}
            <div>
              <label className="block text-neutral-400 uppercase mb-1.5 font-bold">3. Tipo de Sinal (Código do Evento)</label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {EVENTO_OPCOES.map((opt, i) => (
                  <button
                    key={opt.codigo} type="button" onClick={() => setSelectedEvtIdx(i)}
                    className={`w-full p-2 rounded border text-left flex justify-between items-center transition-all ${
                      selectedEvtIdx === i
                        ? 'bg-neutral-950 border-emerald-500 text-white'
                        : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span>{opt.desc}</span>
                    <span className="text-[10px] font-bold bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-emerald-400">
                      {opt.codigo}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Action trigger */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleSimulateHeartbeat}
                className="py-2.5 bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 hover:bg-emerald-950/10 text-neutral-400 hover:text-emerald-400 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-red-500" /> Polling Heartbeat
              </button>
              
              <button
                onClick={handleTransmit}
                className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
              >
                <Send className="w-4 h-4" /> Transmitir Sinal
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Receiver live telemetry analyzer logs view */}
      <div className="lg:col-span-7 bg-neutral-900 border border-emerald-950 rounded-xl p-5 flex flex-col justify-between">
        <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950 pb-2">
          <Terminal className="text-emerald-400 w-4 h-4" /> Monitor de Telecomunicações do Receiver Node.js
        </h4>

        <div className="bg-[#050505] rounded-lg p-4 font-mono text-[10.5px] text-emerald-500 flex-1 my-4 overflow-y-auto max-h-[300px] space-y-2 select-none">
          <span className="text-neutral-500 block">// Receiver Socket Daemon Porta 3000 em escuta para todos os Clientes</span>
          
          {eventsFiredLog.length === 0 ? (
            <p className="text-neutral-600 animate-pulse mt-4">Aguardando telemetria primária. Transmita um sinal para acionar os logs de conexão...</p>
          ) : (
            <div className="space-y-2 pr-1">
              {eventsFiredLog.map(el => (
                <div key={el.id} className="p-2 bg-neutral-950 border border-emerald-950/40 rounded space-y-1 leading-snug">
                  <div className="flex justify-between text-[9px] text-neutral-500">
                    <span>TRANSMITIDO EM: {el.timestamp}</span>
                    <span className="text-emerald-400 font-bold uppercase">Pacote OK [ACK Sent]</span>
                  </div>
                  <p className="text-white break-all">RAW PAYLOAD: <span className="text-emerald-400">{el.raw}</span></p>
                  <p className="text-[10px] text-neutral-400">DEC/MAPPED: {el.parsed}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
          <Server className="w-4 h-4 text-emerald-500" />
          <span>Fluxo: Central &gt; NodeJS Receiver (TCP) &gt; API Express Router &gt; PostgreSQL &gt; Real-time Operator</span>
        </div>
      </div>

    </div>
  );
}
