import { useState } from 'react';
import { AutomationRule } from '../types';
import { ToggleLeft, ToggleRight, Zap, CheckCircle2, Award, Plus, Smartphone, Mail, AlertTriangle } from 'lucide-react';

interface AutomationEngineProps {
  regras: AutomationRule[];
  onToggleRule: (id: number) => void;
  onAddRule: (rule: Omit<AutomationRule, 'id' | 'empresaId'>) => void;
}

export default function AutomationEngine({ regras, onToggleRule, onAddRule }: AutomationEngineProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [nome, setNome] = useState('');
  const [gatilho, setGatilho] = useState('Disparo de Alarme');
  const [condicao, setCondicao] = useState('Sempre Ativo');
  const [actEmail, setActEmail] = useState(true);
  const [actSMS, setActSMS] = useState(false);
  const [actPush, setActPush] = useState(true);
  const [actIA, setActIA] = useState(false);
  const [emailDest, setEmailDest] = useState('administrativo@cliente.com');

  const [testResult, setTestResult] = useState('');

  const handleSubmitRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    onAddRule({
      nome,
      gatilhoEvento: gatilho,
      condicao,
      acaoEmail: actEmail,
      emailDestinatario: emailDest,
      acaoSMS: actSMS,
      acaoPush: actPush,
      acaoIA: actIA,
      ativo: true
    });
    setNome('');
    setShowAdd(false);
  };

  const handleTriggerTestFlow = (ruleNome: string) => {
    setTestResult(`Iniciando fluxo de testes para a regra '${ruleNome}'...`);
    setTimeout(() => {
      setTestResult(`✔ [EMAIL] Alerta despachado com sucesso para ${emailDest}.`);
    }, 1000);
    setTimeout(() => {
      setTestResult(`✔ [PUSH] Notificação enviada para os PWAs registrados na central.`);
    }, 1800);
    setTimeout(() => {
      setTestResult(`✔ Regra de Automação '${ruleNome}' executada com taxa de sucesso de 100% (Latência total: 45ms).`);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview header */}
      <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="text-emerald-400 w-4.5 h-4.5 animate-bounce" /> Engine de Automatizações de Telemetria
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Elimine furos operacionais. Programe gatilhos de acionamento imediato por e-mail, push, IA e webhook táticos.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded font-mono text-xs uppercase flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nova Regra de Automatização
        </button>
      </div>

      {testResult && (
        <div className="p-3 bg-neutral-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs rounded transition-all">
          ⚡ {testResult}
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleSubmitRule} className="bg-neutral-900 border border-emerald-950 p-6 rounded-xl space-y-4 max-w-2xl">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold border-b border-emerald-950 pb-2">
            Adicionar Nova Regra "If-Then"
          </span>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Nome da Regra</label>
              <input
                type="text" required value={nome} onChange={e => setNome(e.target.value)}
                placeholder="Ex: Alavanca de Pânico - Enviar Brigada local"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">SE OCORRER (Gatilho)</label>
              <select
                value={gatilho} onChange={e => setGatilho(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white uppercase font-mono"
              >
                <option value="Disparo de Alarme">Disparo de Alarme (Sinals 1120/1130)</option>
                <option value="Queda de Energia">Queda de Energia AC (1301)</option>
                <option value="Bateria Baixa">Bateria Baixa (1302)</option>
                <option value="Central Armada">Central Armada (3401)</option>
                <option value="Serviço Manual">Pânico Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">ESTANDO NA CONDIÇÃO</label>
              <input
                type="text" value={condicao} onChange={e => setCondicao(e.target.value)}
                placeholder="Ex: Sempre Ativo / Fora do Horário Comercial"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="py-2">
            <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase font-bold">ENTÃO EXECUTE AS SEGUINTES ATIVIDADES</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-950 p-4 border border-emerald-950/40 rounded">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
                <input
                  type="checkbox" checked={actEmail} onChange={e => setActEmail(e.target.checked)}
                  className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4 accent-emerald-500"
                />
                Enviar E-mail
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
                <input
                  type="checkbox" checked={actSMS} onChange={e => setActSMS(e.target.checked)}
                  className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4 accent-emerald-500"
                />
                Enviar SMS
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
                <input
                  type="checkbox" checked={actPush} onChange={e => setActPush(e.target.checked)}
                  className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4 accent-emerald-500"
                />
                Enviar Push PWA
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
                <input
                  type="checkbox" checked={actIA} onChange={e => setActIA(e.target.checked)}
                  className="rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4 accent-emerald-500"
                />
                Triagem por IA
              </label>
            </div>
          </div>

          {actEmail && (
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">Destinatário do E-mail</label>
              <input
                type="email" required value={emailDest} onChange={e => setEmailDest(e.target.value)}
                placeholder="gestao@propriedade.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs text-white font-mono"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button" onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white rounded text-xs uppercase font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded text-xs uppercase font-mono"
            >
              Criar Automação
            </button>
          </div>
        </form>
      )}

      {/* Rules stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regras.map(rule => (
          <div key={rule.id} className="p-5 rounded-2xl bg-neutral-900 border border-emerald-950 hover:border-emerald-500/20 transition-all space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-bold text-sm tracking-tight">{rule.nome}</h4>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">VINCULO: EMP-000001 // RECON</p>
              </div>

              {/* Status toggle button */}
              <button
                onClick={() => onToggleRule(rule.id)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                {rule.ativo ? (
                  <ToggleRight className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-neutral-600" />
                )}
              </button>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg text-xs font-mono text-neutral-300 space-y-1.5">
              <p>
                <span className="text-emerald-500 font-bold">SE ENTRAR:</span> {rule.gatilhoEvento}
              </p>
              <p>
                <span className="text-emerald-500 font-bold">CONDIÇÃO:</span> {rule.condicao}
              </p>
              <div className="flex gap-2.5 pt-1.5 border-t border-emerald-950/40 text-[9px]">
                <span className={rule.acaoEmail ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>✉ EMAIL</span>
                <span className={rule.acaoSMS ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>💬 SMS</span>
                <span className={rule.acaoPush ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>📱 PUSH PWA</span>
                <span className={rule.acaoIA ? 'text-emerald-500 font-bold' : 'text-neutral-600'}>🤖 IA TRIAGE</span>
              </div>
            </div>

            <button
              onClick={() => handleTriggerTestFlow(rule.nome)}
              disabled={!rule.ativo}
              className="w-full py-2 bg-neutral-950 border border-neutral-800 hover:border-emerald-500 hover:bg-emerald-950/10 text-neutral-300 hover:text-white font-mono text-xs uppercase rounded cursor-pointer transition-all disabled:opacity-50"
            >
              Testar Fluxo da Automação
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
