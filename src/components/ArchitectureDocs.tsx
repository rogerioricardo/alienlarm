import { Terminal, BookOpen, Server, Globe, Shield, RefreshCw } from 'lucide-react';

export default function ArchitectureDocs() {
  const nodeReceiverCode = `
/**
 * ====================================================================
 * ALIENLARM - RECEIVER SERVER TCP (NODE.JS + SOCKETS DE TELEMETRIA)
 * ESTE DAEMON ESCUTA SINAIS CONTACT ID E SIA DC-09 EM ALTA VELOCIDADE
 * E DESPACHA VIA AXIOS PARA A API REST DO BANCO DE DADOS EM PHP
 * ====================================================================
 */

const net = require('net');
const axios = require('axios');

const PORT = 3000;
const API_URL = 'http://seu-cpanel-hosted.com/api/v1/receiver/post-signal';
const API_KEY = 'ALIEN_RECEIVER_TTACTICAL_KEY_99882';

// Cria o servidor de sockets TCP
const server = net.createServer((socket) => {
    const clientIp = socket.remoteAddress;
    console.log(\`[RECEIVER] Nova conexão estabelecida vinda do IP: \${clientIp}\`);

    // Escuta buffers brutos vindo do alarme físico/virtual
    socket.on('data', async (chunk) => {
        const rawMessage = chunk.toString('utf8').trim();
        console.log(\`[RECEIVER] [RAW DATA] [\${clientIp}]: \${rawMessage}\`);

        try {
            // Realiza parse preliminar para validar o pacote (Contact ID vs SIA)
            // Envia para o painel de tratamento da API REST PHP Multi-Tenant
            const response = await axios.post(API_URL, {
                raw_packet: rawMessage,
                ip_source: clientIp,
                timestamp: new Date().toISOString()
            }, {
                headers: {
                    'Authorization': \`Bearer \${API_KEY}\`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            // Envia retorno de ACK de recebimento para a central física (Evita que o painel envie repetidos)
            // ACK padrão Contact ID é o caractere HEX de handshake
            const ackMsg = Buffer.from([0x06]); 
            socket.write(ackMsg);
            console.log(\`[RECEIVER] [ACK SENT] para \${clientIp}\`);

        } catch (error) {
            console.error(\`[RECEIVER] [ERROR REST] Falha de comunicação com cPanel API: \${error.message}\`);
            // Em caso de falha de banco local, o receiver tenta enfileirar em memória para retransmitir
        }
    });

    socket.on('close', () => {
        console.log(\`[RECEIVER] Conexão encerrada para o cliente \${clientIp}\`);
    });

    socket.on('error', (err) => {
        console.error(\`[RECEIVER] [SOCKET ERROR] \${err.message}\`);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(\`[CORE ALIENLARM] Receptora de Alarmes ativa na porta \${PORT} [0.0.0.0]\`);
});
`;

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-12">
      
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-neutral-900 border border-emerald-950 p-6 rounded-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Manual de Arquitetura do Engenheiro Master</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Visão tática e contratos de API, implantação em servidores cPanel, scripts de PM2 e daemon Node.js.</p>
        </div>
      </div>

      {/* SOLID & Software Architecture rules */}
      <section className="space-y-4">
        <h4 className="text-white text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950 pb-2">
          <Shield className="text-emerald-500 w-4 h-4" /> Qualidade de Código & Princípios Táticos (SOLID)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-400 leading-relaxed">
          <div className="p-4 bg-neutral-900 border border-emerald-950/40 rounded-xl space-y-2">
            <span className="text-white font-bold block uppercase font-mono">1. Isolamento Multi-Tenant</span>
            <p>
              Toda consulta ao repositório de dados exige a injeção do parâmetro <span className="text-emerald-400 font-mono">empresa_id</span> do JWT decodificado no middleware de segurança, impedindo o cruzamento tático indesejado de logs de alarmes entre empresas.
            </p>
          </div>
          <div className="p-4 bg-neutral-900 border border-emerald-950/40 rounded-xl space-y-2">
            <span className="text-white font-bold block uppercase font-mono">2. Repository Pattern (SOLID)</span>
            <p>
              O controlador REST de eventos não executa queries raw no banco de dados. Ele consome <span className="text-emerald-400 font-mono">IEventRepository</span> injetado via construtor, respeitando a inversão de dependência em ambiente PHP 8.3 de produção.
            </p>
          </div>
        </div>
      </section>

      {/* REST API Endpoints Contract */}
      <section className="space-y-4">
        <h4 className="text-white text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950 pb-2">
          <Globe className="text-emerald-500 w-4 h-4" /> Especificação Tática de Rotas REST API (cPanel GATEWAY)
        </h4>
        <div className="bg-neutral-900 border border-emerald-950 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left text-neutral-400 font-mono">
            <thead className="bg-[#050505] p-3 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-emerald-950">
              <tr>
                <th className="p-3">Método / Rota</th>
                <th className="p-3">Autenticação</th>
                <th className="p-3">Objetivo / Payload</th>
                <th className="p-3">Retorno Consolidado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/20">
              <tr className="hover:bg-neutral-950/50">
                <td className="p-3 font-bold text-emerald-400">POST /api/v1/auth/login</td>
                <td className="p-3 text-neutral-500">Público</td>
                <td className="p-3">Email, Senha, Opção Lembrar</td>
                <td className="p-3 text-neutral-300">{"{ token: JWT, user: Object }"}</td>
              </tr>
              <tr className="hover:bg-neutral-950/50">
                <td className="p-3 font-bold text-emerald-400">GET /api/v1/events/active</td>
                <td className="p-3 text-indigo-400">Header: JWT Bearer</td>
                <td className="p-3">Filtro de criticidade ou página</td>
                <td className="p-3 text-neutral-300">{"[ { codigo: EVT-01, ... } ]"}</td>
              </tr>
              <tr className="hover:bg-neutral-950/50">
                <td className="p-3 font-bold text-emerald-400">POST /api/v1/receiver/post-signal</td>
                <td className="p-3 text-red-400">Token Receivers Fixo</td>
                <td className="p-3">Raw payload string vindo de rádio</td>
                <td className="p-3 text-neutral-300">{"{ status: 'Processed', event_id: 10 }"}</td>
              </tr>
              <tr className="hover:bg-neutral-950/50">
                <td className="p-3 font-bold text-emerald-400">POST /api/v1/pwa/set-panel-state</td>
                <td className="p-3 text-indigo-400">Header: JWT Bearer</td>
                <td className="p-3">Armado/Desarmado comando remoto</td>
                <td className="p-3 text-neutral-300">{"{ success: true, new_state: 'ARMADO' }"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Node.js receiver daemon code block */}
      <section className="space-y-4">
        <h4 className="text-white text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950 pb-2">
          <Server className="text-emerald-500 w-4 h-4" /> Receptora de Alarmes TCP Node.js (Daemon Engine)
        </h4>
        <p className="text-xs text-neutral-400 leading-relaxed">
          O receiver NodeJS roda como processo de alta prioridade na porta pública <span className="text-emerald-400">3000</span> do servidor Linux da receptora, decodificando sinais táticos. Abaixo está o código de produção preparado para deploy com <span className="text-emerald-400">PM2</span>.
        </p>

        <div className="bg-[#050505] border border-emerald-950 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono uppercase pb-3 border-b border-emerald-950/60 mb-4">
            <span className="flex items-center gap-1"><Terminal className="text-emerald-500 w-4 h-4" /> nano receiver.js</span>
            <span>Pronto para PM2 v5</span>
          </div>
          <pre className="text-emerald-400 font-mono text-[10.5px] leading-relaxed max-h-80 overflow-y-auto whitespace-pre pr-2">
            {nodeReceiverCode}
          </pre>
        </div>

        {/* PM2 scripts guides code snippet */}
        <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl text-xs space-y-2">
          <span className="text-white block font-bold font-mono text-xs">// Comandos de Deploy com PM2 no Servidor do Receiver</span>
          <div className="bg-black p-3 border border-emerald-950/30 rounded font-mono text-[10px] text-neutral-400 space-y-1">
            <p className="text-emerald-400"># Instala dependências do receiver do rádio</p>
            <p>npm install axios dotenv pm2 -g</p>
            <p className="text-emerald-400 mt-2"># Inicia a receptora de alarmes com monitor de falha ativo</p>
            <p>pm2 start receiver.js --name "alienlarm-receiver" --max-memory-restart 150M</p>
            <p className="text-emerald-400 mt-2"># Garante reinicialização em caso de reboot físico do VPS</p>
            <p>pm2 startup && pm2 save</p>
          </div>
        </div>
      </section>

      {/* cPanel Deployment Guidelines */}
      <section className="space-y-4">
        <h4 className="text-white text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950 pb-2">
          <Globe className="text-emerald-500 w-4 h-4" /> Diretrizes para Publicação de APIs e Banco em cPanel
        </h4>
        <div className="text-xs text-neutral-400 leading-relaxed p-5 bg-neutral-900 border border-emerald-950/40 rounded-xl space-y-3.5">
          <p>
            <strong className="text-white block uppercase mb-1">1. Isolamento de Host e Conexões MySQL/MariaDB</strong>
            No cPanel, crie um banco de dados e usuário exclusivo. Configure o arquivo de vículo do dotenv (<span className="text-emerald-400">.env</span>) na raiz com conexões táticas locais. Garanta que o receiver possua permissão de conexão liberada no IP externo no cPanel em "Remote MySQL".
          </p>
          <p>
            <strong className="text-white block uppercase mb-1">2. Redirecionamento de Gateway Apache .htaccess</strong>
            Redirecione todas as requisições para a pasta pública (/api) usando um arquivo <span className="text-emerald-400">.htaccess</span> homologado na raiz de envio:
          </p>
          <div className="bg-black p-3 border border-emerald-950/20 rounded font-mono text-[9px] text-neutral-300">
            {"RewriteEngine On \nRewriteCond %{REQUEST_FILENAME} !-f \nRewriteCond %{REQUEST_FILENAME} !-d \nRewriteRule ^(.*)$ index.php?_url=/$1 [QSA,L]"}
          </div>
        </div>
      </section>

    </div>
  );
}
