import { useState } from 'react';
import { Central } from '../types';
import { Wrench, Settings, AlertTriangle, Play, CheckCircle2, Shield, Signal, Layers } from 'lucide-react';

interface TechnicianViewProps {
  centrais: Central[];
  empresaId: number;
  onUpdateZonas: (centralId: number, zonas: { numero: number; nome: string; status: 'Normal' | 'Aberta' | 'Violada' }[]) => void;
}

export default function TechnicianView({ centrais, empresaId, onUpdateZonas }: TechnicianViewProps) {
  const myCentrais = centrais.filter(c => c.empresaId === empresaId);
  const [selectedCtrId, setSelectedCtrId] = useState<number | null>(myCentrais[0]?.id || null);
  const activeCentral = myCentrais.find(c => c.id === selectedCtrId);

  // Equipment catalog mock data
  const EQUIPAMENTOS_CATALOGO = [
    { id: 1, nome: "Sensor de Movimento IVP Transmissor Pet", marca: "Intelbras", tipo: "Membro Parede Sem Fio" },
    { id: 2, nome: "Teclado Alfanumérico LCD 16", marca: "Paradox", tipo: "Interface Serial Bus" },
    { id: 3, nome: "Módulo Multi-Transmissor GPRS 4G Dual", marca: "Kripton", tipo: "Backup por Telemetria" },
    { id: 4, nome: "Sensor Magnético de Abertura de Portões", marca: "JFL", tipo: "Entrada Blindada" }
  ];

  // Test state
  const [testLog, setTestLog] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const triggerDiagnosticTest = () => {
    if (!activeCentral) return;
    setTesting(true);
    setTestLog([`[PING] Iniciando autodiagnóstico remoto na central de conta ${activeCentral.contaPreconfigurada}...`]);
    
    setTimeout(() => {
      setTestLog(prev => [...prev, `[PROTOCOLO] Conectando via ${activeCentral.protocolo} ao receiver porta 3000... ok.`]);
    }, 800);

    setTimeout(() => {
      setTestLog(prev => [...prev, `[SINAL] Nível de sinal GPRS RSSI: 24dBm (Estável / Excelente).`]);
    }, 1500);

    setTimeout(() => {
      const logs = activeCentral.zonas.map(z => `[ZONA ${z.numero}] Teste de integridade de barramento de resistor do fim de linha (${z.nome}) -> Retornou normal.`);
      setTestLog(prev => [...prev, ...logs]);
    }, 2200);

    setTimeout(() => {
      setTestLog(prev => [...prev, `✔ Autodiagnóstico concluído! Central operando na frequência tática nominal.`]);
      setTesting(false);
    }, 3000);
  };

  const handleZoneSimulate = (zonaNum: number, novoStatus: 'Normal' | 'Aberta' | 'Violada') => {
    if (!activeCentral) return;
    const novasZonas = activeCentral.zonas.map(z => {
      if (z.numero === zonaNum) {
        return { ...z, status: novoStatus };
      }
      return z;
    });
    onUpdateZonas(activeCentral.id, novasZonas);
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 p-4 rounded-xl border border-emerald-950/40 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="text-emerald-500 w-4.5 h-4.5 animate-spin" style={{ animationDuration: '6s' }} />
            Workbench Tático do Técnico Instalador
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Realize parametrizações de resistor EOL, testes de zonas e envie resets temporários para o receiver.</p>
        </div>

        {/* Central selector */}
        {myCentrais.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Monitorando Central:</span>
            <select
              value={selectedCtrId || ''}
              onChange={e => setSelectedCtrId(Number(e.target.value))}
              className="bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-1.5 text-xs text-white uppercase font-mono font-bold"
            >
              {myCentrais.map(c => (
                <option key={c.id} value={c.id}>{c.nomeIdentificacao} ({c.contaPreconfigurada})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!activeCentral ? (
        <div className="p-8 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
          Nenhuma Central cadastrada nesta empresa para manutenção tática. Crie uma no menu de Administrador.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main config: zones status list */}
          <div className="bg-neutral-900 border border-emerald-950 rounded-xl p-5 lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950 pb-2">
              <Layers className="text-emerald-500 w-4 h-4" /> Configuração e Simulação de Zonas e Loop de Entrada
            </h4>

            <div className="space-y-2.5">
              {activeCentral.zonas.map(zona => (
                <div key={zona.numero} className="p-3 bg-neutral-950 border border-neutral-800 rounded flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 font-bold block">[ZONA 0{zona.numero}]</span>
                    <span className="text-white font-sans text-sm">{zona.nome}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status badge */}
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold mr-3 border ${
                      zona.status === 'Normal' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-950/25' :
                      zona.status === 'Aberta' ? 'border-amber-500/20 text-amber-500 bg-amber-950/25' :
                      'border-red-500/30 text-red-500 bg-red-950/25'
                    }`}>
                      {zona.status}
                    </span>

                    {/* Simulation buttons */}
                    <button
                      onClick={() => handleZoneSimulate(zona.numero, 'Normal')}
                      className="px-2 py-1 text-[9px] uppercase bg-neutral-900 hover:bg-emerald-950 border border-neutral-800 hover:border-emerald-500 rounded text-neutral-400 hover:text-white transition-all cursor-pointer"
                    >
                      Normal (Res.)
                    </button>
                    <button
                      onClick={() => handleZoneSimulate(zona.numero, 'Aberta')}
                      className="px-2 py-1 text-[9px] uppercase bg-neutral-900 hover:bg-amber-950 border border-neutral-800 hover:border-amber-500 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                      Abrir (Set)
                    </button>
                    <button
                      onClick={() => handleZoneSimulate(zona.numero, 'Violada')}
                      className="px-2 py-1 text-[9px] uppercase bg-neutral-900 hover:bg-red-950 border border-neutral-800 hover:border-red-500 rounded text-red-300 hover:text-white transition-all cursor-pointer"
                    >
                      Violado (Alarme)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnostic trigger actions */}
            <div className="pt-3 border-t border-emerald-950 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[10px] text-neutral-500 font-mono">
                Pulsos simulados atualizam diretamente os receptores do painel do operador em tempo real.
              </span>
              <button
                onClick={triggerDiagnosticTest}
                disabled={testing}
                className="w-full sm:w-auto px-4 py-2 bg-neutral-950 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/40 text-emerald-400 font-mono text-xs uppercase rounded flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Signal className="w-4 h-4 animate-bounce" /> {testing ? 'Injetando Pings...' : 'Auto Diagnóstico Remoto'}
              </button>
            </div>
          </div>

          {/* Test log terminal & equipments */}
          <div className="space-y-6">
            {/* Terminal log */}
            {testLog.length > 0 && (
              <div className="p-4 bg-[#050505] border border-emerald-950 rounded-xl font-mono text-[10px] text-emerald-400 space-y-2">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">Terminal Socket Diagnostics Log</span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                  {testLog.map((log, i) => (
                    <p key={i} className="leading-relaxed border-b border-emerald-950/20 pb-1 last:border-0">{log}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Catalog catalog summary */}
            <div className="bg-neutral-900 border border-emerald-950 rounded-xl p-5">
              <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Settings className="text-emerald-500 w-4 h-4" /> Assistência Técnica de Equipamentos
              </h4>
              <div className="space-y-2.5">
                {EQUIPAMENTOS_CATALOGO.map(eq => (
                  <div key={eq.id} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">{eq.nome}</span>
                      <span className="text-[9px] text-neutral-500">{eq.marca}</span>
                    </div>
                    <span className="text-[9px] text-emerald-500 block uppercase mt-0.5">// {eq.tipo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
