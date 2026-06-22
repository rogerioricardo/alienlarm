import { useState, useEffect, useRef } from 'react';
import { Central, Evento } from '../types';
import { Shield, ShieldAlert, Video, Plus, Ticket, Compass, BellRing, Eye, ArrowUpCircle } from 'lucide-react';

interface ClientPWAViewProps {
  centrais: Central[];
  eventos: Evento[];
  empresaId: number;
  onToggleArm: (centralId: number, armState: 'DESARMADO' | 'ARMADO' | 'DISPARADO') => void;
}

export default function ClientPWAView({ centrais, eventos, empresaId, onToggleArm }: ClientPWAViewProps) {
  // Only the central associated with the demo client
  const myCentrais = centrais.filter(c => c.empresaId === empresaId);
  const activeCentral = myCentrais[0]; // first demo central

  // Camera canvas rendering effect for high-fidelity interactive camera streaming mockup
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCam, setActiveCam] = useState<'ESTOQUE' | 'PORTÃO-E' | 'RECEPÇÃO'>('ESTOQUE');

  // Tickets layout
  const [tickets, setTickets] = useState([
    { id: 1, cod: "TCK-410", assunto: "Instalação de Novo Sensor de Presença Pet", status: "Em Atendimento" },
    { id: 2, cod: "TCK-392", assunto: "Sinal Fraco da Antena backup GPRS", status: "Resolvido" }
  ]);
  const [newTicket, setNewTicket] = useState('');

  const handleToggleState = () => {
    if (!activeCentral) return;
    const nextState = activeCentral.statusAlarme === 'ARMADO' ? 'DESARMADO' : 'ARMADO';
    onToggleArm(activeCentral.id, nextState);
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket) return;
    setTickets(prev => [
      ...prev,
      { id: Date.now(), cod: `TCK-${Math.floor(100 + Math.random() * 899)}`, assunto: newTicket, status: 'Aberto' }
    ]);
    setNewTicket('');
  };

  useEffect(() => {
    // Render funny retro security lines matrix canvas simulation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#143520';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 15) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw bounding box / camera scanner
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Draw tracking boxes
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      const trackX = canvas.width / 2 + Math.sin(frame / 30) * 40 - 25;
      const trackY = canvas.height / 2 + Math.cos(frame / 45) * 20 - 20;
      ctx.fillRect(trackX, trackY, 50, 40);

      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(trackX, trackY, 50, 40);

      ctx.fillStyle = '#10b981';
      ctx.font = '8px monospace';
      ctx.fillText('TARGET DETECTED [CAM_SEC_01]', trackX - 5, trackY - 5);

      // Crosshair
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - 10);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 + 10);
      ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2);
      ctx.stroke();

      // CRT Scanline flicker effect
      ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
      const scanLine = (frame % canvas.height);
      ctx.fillRect(0, scanLine, canvas.width, 3);

      // Timestamp
      ctx.fillStyle = '#10b981';
      ctx.fillText(`ALIENLARM TELEMETRY // REC: ${activeCam}`, 15, 25);
      ctx.fillText(`2026-06-22 ${new Date().toLocaleTimeString()}`, 15, canvas.height - 18);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeCam]);

  return (
    <div className="flex justify-center max-w-4xl mx-auto font-sans p-2">
      {/* Phone simulator framing */}
      <div className="w-80 h-[660px] border-[6px] border-neutral-800 rounded-[44px] bg-neutral-950 p-4 relative shadow-[0_0_50px_rgba(16,185,129,0.22)] overflow-hidden">
        {/* Notch container */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-20 flex items-center justify-center">
          <span className="w-12 h-1 bg-neutral-900 rounded-full" />
        </div>

        {/* Home Screen Core Container */}
        <div className="w-full h-full bg-[#050505] rounded-[32px] overflow-y-auto overflow-x-hidden p-4 pt-8 text-neutral-200 flex flex-col justify-between font-mono text-[11px] hide-scrollbar select-none relative">
          
          <div>
            {/* Header branding */}
            <div className="flex justify-between items-center text-neutral-500 mb-6">
              <span className="font-bold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400" /> ALIEN_LARM_OS
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> CONNECTED
              </span>
            </div>

            {/* Arm Disarm display */}
            {activeCentral ? (
              <div className="bg-neutral-900 border border-emerald-950/80 rounded-2xl p-4 text-center space-y-4 shadow-[0_0_15px_rgba(16,185,129,0.02)]">
                <div>
                  <span className="text-[10px] text-neutral-400 tracking-widest block uppercase">Central Residencial</span>
                  <span className="text-sm font-sans font-bold text-white block mt-0.5">{activeCentral.nomeIdentificacao}</span>
                </div>

                {/* Simulated status shield */}
                <div className="flex justify-center">
                  <button
                    onClick={handleToggleState}
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.1)] ${
                      activeCentral.statusAlarme === 'ARMADO' 
                        ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400' 
                        : 'border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-emerald-500/40'
                    }`}
                  >
                    {activeCentral.statusAlarme === 'ARMADO' ? (
                      <>
                        <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-bold mt-1 tracking-widest">ARMADO</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-8 h-8 text-neutral-500" />
                        <span className="text-[8px] font-bold mt-1 tracking-widest text-neutral-500">DESARMADO</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-neutral-500">
                  {activeCentral.statusAlarme === 'ARMADO' 
                    ? 'Pressione o escudo para desarmar a propriedade' 
                    : 'Pressione o escudo para armar no modo Total'}
                </p>
              </div>
            ) : (
              <span className="text-neutral-500">Nenhuma central vinculada.</span>
            )}

            {/* Simulated Live Cameras */}
            <div className="mt-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-bold flex items-center gap-1.5"><Video className="w-4 h-4 text-emerald-500" /> CÂMERAS CFTV NUVEM</span>
                <div className="flex gap-1 text-[9px]">
                  {['ESTOQUE', 'PORTÃO-E', 'RECEPÇÃO'].map(cam => (
                    <button
                      key={cam}
                      onClick={() => setActiveCam(cam as any)}
                      className={`px-1.5 py-0.5 rounded border border-neutral-800 ${activeCam === cam ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'text-neutral-500'}`}
                    >
                      {cam === 'PORTÃO-E' ? 'PORTÃO' : cam}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Display Viewport using canvas */}
              <div className="relative border border-emerald-950 rounded-xl overflow-hidden bg-black">
                <canvas ref={canvasRef} width={280} height={150} className="w-full h-[150px] block" />
              </div>
            </div>

            {/* Support ticket creation */}
            <div className="mt-5 space-y-3">
              <span className="text-neutral-400 font-bold flex items-center gap-1.5"><Ticket className="w-4 h-4 text-emerald-400" /> CHAMADO DE SUPORTE</span>
              <form onSubmit={handleAddTicket} className="flex gap-1">
                <input
                  type="text" required value={newTicket} onChange={e => setNewTicket(e.target.value)}
                  placeholder="Preciso ajustar barramento zona 1..."
                  className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-[10px] text-white"
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-emerald-500 text-neutral-950 font-bold rounded uppercase text-[10px]"
                >
                  Criar
                </button>
              </form>

              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {tickets.map(t => (
                  <div key={t.id} className="p-2 rounded bg-neutral-900 border border-neutral-800/60 flex justify-between items-center text-[10px]">
                    <span className="text-white line-clamp-1 flex-1 pr-2">{t.assunto}</span>
                    <span className={`px-1.5 rounded uppercase font-bold text-[8px] ${
                      t.status === 'Resolvido' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-6 pt-3 border-t border-emerald-950/40 text-center text-[9px] text-neutral-600">
            AlienLarm PWA Mobile Application v4.5 // Secure
          </div>

        </div>
      </div>
    </div>
  );
}
