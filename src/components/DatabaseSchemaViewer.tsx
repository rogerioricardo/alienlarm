import { useState } from 'react';
import { Database, Copy, Check, Terminal, Layers } from 'lucide-react';

export default function DatabaseSchemaViewer() {
  const [copied, setCopied] = useState(false);

  const sqlSchema = `
-- ====================================================================
-- ALIENLARM - DDL SCHEMA RELACIONAL DE BANCO DE DADOS COMPLETO (MySQL 8.0+)
-- PRODUTO ENTERPRISE MULTI-TENANT E SEGURO COM UUID E CÓDIGOS AMIGÁVEIS
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABELA DE PLANOS DE ASSINATURA SAAS
CREATE TABLE planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    limite_centrais INT NOT NULL DEFAULT 50,
    limite_usuarios INT NOT NULL DEFAULT 10,
    valor_mensal DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABELA DE TENANTS (EMPRESAS MONITORADORAS)
CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- CLI-000001
    nome_fantasia VARCHAR(150) NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('Ativa', 'Suspensa') NOT NULL DEFAULT 'Ativa',
    plano_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresas_planos FOREIGN KEY (plano_id) REFERENCES planos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABELA DE USUÁRIOS DO SISTEMA (MASTER, ADMIN, INSTALADOR, OPERADOR, CLIENTE_PWA)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- USR-000001
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    funcao ENUM('MASTER', 'ADMIN', 'TECNICO', 'OPERADOR', 'CLIENTE') NOT NULL,
    empresa_id INT NULL, -- NULL para Master Admin do SaaS
    telefone VARCHAR(25) NULL,
    status ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
    dois_fa_preparado TINYINT(1) DEFAULT 0,
    dois_fa_segredo VARCHAR(80) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABELA DE PERMISSÕES POR FUNÇÃO
CREATE TABLE permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcao ENUM('MASTER', 'ADMIN', 'TECNICO', 'OPERADOR', 'CLIENTE') NOT NULL,
    recurso_modulo VARCHAR(100) NOT NULL,
    pode_criar TINYINT(1) NOT NULL DEFAULT 0,
    pode_ler TINYINT(1) NOT NULL DEFAULT 1,
    pode_atualizar TINYINT(1) NOT NULL DEFAULT 0,
    pode_deletar TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT uq_funcao_modulo UNIQUE (funcao, recurso_modulo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABELA DE CLIENTES VINCULADOS A CADA TENANT
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- CLI-000001
    nome VARCHAR(150) NOT NULL,
    cnpj_cpf VARCHAR(25) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    empresa_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_clientes_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABELA DE ENDEREÇOS DOS CLIENTES DO MONITORAMENTO
CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL UNIQUE,
    rua VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(120) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(15) NOT NULL,
    CONSTRAINT fk_enderecos_clientes FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABELA DE FABRICANTES DE CENTRAIS
CREATE TABLE fabricantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABELA DE MODELOS HOMOLOGADOS POR MODELO
CREATE TABLE modelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fabricante_id INT NOT NULL,
    nome_modelo VARCHAR(100) NOT NULL,
    CONSTRAINT fk_modelos_fabricantes FOREIGN KEY (fabricante_id) REFERENCES fabricantes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. PROTOCOLOS DE RECECPÇÃO TÁTICA
CREATE TABLE protocolos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_protocolo ENUM('ContactID', 'SIA_DC09', 'JSON_REST', 'MQTT') NOT NULL,
    porta_escuta INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. TABELA DE EQUIPAMENTOS DA CENTRAL (CENTRAIS MONITORADAS)
CREATE TABLE centrais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- CTR-000001
    cliente_id INT NOT NULL,
    empresa_id INT NOT NULL,
    modelo_id INT NOT NULL,
    protocolo_id INT NOT NULL,
    conta_preconfigurada CHAR(4) NOT NULL, -- Ex: 4815
    status_conexao ENUM('ONLINE', 'OFFLINE') DEFAULT 'ONLINE',
    status_alarme ENUM('DESARMADO', 'ARMADO', 'DISPARADO') DEFAULT 'DESARMADO',
    ultimo_heartbeat TIMESTAMP NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_centrais_clientes FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_centrais_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    CONSTRAINT fk_centrais_modelos FOREIGN KEY (modelo_id) REFERENCES modelos(id),
    CONSTRAINT fk_centrais_protocolos FOREIGN KEY (id) REFERENCES protocolos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. TABELA DE ESPECIFICAÇÃO DE TIPOS DE EVENTO (INCIDENTES DA CENTRAL)
CREATE TABLE tipos_eventos (
    codigo_evento CHAR(4) PRIMARY KEY, -- E130, R130, E121
    descricao_evento VARCHAR(150) NOT NULL,
    criticidade ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. TABELA DE EVENTOS (FATOS OCORRIDOS DA TELEMETRIA)
CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- EVT-000001
    central_id INT NOT NULL,
    empresa_id INT NOT NULL,
    codigo_evento CHAR(4) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_tratamento ENUM('PENDENTE', 'EM_TRATAMENTO', 'RESOLVIDO') DEFAULT 'PENDENTE',
    origem_pacote_raw VARCHAR(255) NOT NULL,
    CONSTRAINT fk_eventos_centrais FOREIGN KEY (central_id) REFERENCES centrais(id) ON DELETE CASCADE,
    CONSTRAINT fk_eventos_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    CONSTRAINT fk_eventos_tipos FOREIGN KEY (codigo_evento) REFERENCES tipos_eventos(codigo_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. TABELA DE ATENDIMENTOS (AÇÃO HUMANA SOBRE O EVENTO)
CREATE TABLE atendimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- ATD-000001
    evento_id INT NOT NULL,
    operador_id INT NOT NULL,
    data_hora_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_hora_fim TIMESTAMP NULL,
    status ENUM('Aberto', 'Finalizado') NOT NULL DEFAULT 'Aberto',
    CONSTRAINT fk_atendimentos_eventos FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    CONSTRAINT fk_atendimentos_usuarios FOREIGN KEY (operador_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. TABELA DE HEARTBEAT (CONTROLE DE POLLING ONLINE/OFFLINE)
CREATE TABLE heartbeat (
    central_id INT PRIMARY KEY,
    ultimo_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    duracao_intervalo_segundos INT DEFAULT 60,
    CONSTRAINT fk_heartbeat_centrais FOREIGN KEY (central_id) REFERENCES centrais(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. TABELA DE TÉCNICOS CADASTRADOS POR EMPRESA
CREATE TABLE tecnicos (
    usuario_id INT PRIMARY KEY,
    crea_registro VARCHAR(50) NULL,
    registro_instalador VARCHAR(50) NOT NULL,
    CONSTRAINT fk_tecnicos_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. TABELA DE OPERADORES CADASTRADOS POR EMPRESA
CREATE TABLE operadores (
    usuario_id INT PRIMARY KEY,
    turno VARCHAR(30) NOT NULL,
    cargo_estacao VARCHAR(50) NOT NULL,
    CONSTRAINT fk_operadores_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. TABELA DE DETALHE DE EQUIPAMENTOS FISICOS NA CENTRAL
CREATE TABLE equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    central_id INT NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- Sensor, Teclado, Bateria
    num_serial VARCHAR(100) UNIQUE NOT NULL,
    fabricado_em DATE NULL,
    CONSTRAINT fk_equipamentos_centrais FOREIGN KEY (central_id) REFERENCES centrais(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. COMANDOS DE ACESSO REMOTO
CREATE TABLE comandos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comando_tx VARCHAR(100) NOT NULL, -- Ex: BYPASS_ZONE, ARM_STAY
    descricao_comando VARCHAR(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. FILA DE COMANDOS SAÍDA (PENDENTES DO RECEIVER)
CREATE TABLE fila_comandos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    central_id INT NOT NULL,
    comando_id INT NOT NULL,
    parametro_adicional VARCHAR(100) NULL,
    status ENUM('PENDENTE', 'ENVIADO', 'FALHOU') NOT NULL DEFAULT 'PENDENTE',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fila_centrais FOREIGN KEY (central_id) REFERENCES centrais(id) ON DELETE CASCADE,
    CONSTRAINT fk_fila_comandos FOREIGN KEY (comando_id) REFERENCES comandos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. TABELA DE LOGS DE SISTEMA GERAIS
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nivel ENUM('INFO', 'WARNING', 'ERROR') DEFAULT 'INFO',
    mensagem TEXT NOT NULL,
    empresa_id INT NULL,
    CONSTRAINT fk_logs_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21. LOGS DE FLUXO DE RECEIVER TCP/UDP
CREATE TABLE logs_receiver (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    raw_packet_bytes VARCHAR(512) NOT NULL,
    latencia_ms INT NOT NULL,
    ip_origem VARCHAR(45) NOT NULL,
    conta_identificada CHAR(4) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22. LOGS DE LOGIN E ATIVIDADE DE AUTENTICAÇÃO
CREATE TABLE logs_login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45) NOT NULL,
    sucesso TINYINT(1) NOT NULL,
    userAgent VARCHAR(255) NULL,
    CONSTRAINT fk_logs_login_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 23. FILA DE NOTIFICAÇÕES (PUSH, WHATSAPP, EMAIL)
CREATE TABLE notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    tipo_meio ENUM('EMAIL', 'SMS', 'PUSH', 'WHATSAPP') NOT NULL,
    destinatario VARCHAR(150) NOT NULL,
    status_envio ENUM('PENDENTE', 'ENVIADO', 'FALHOU') DEFAULT 'PENDENTE',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_eventos FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 24. TABELA DE ASSINATURAS DO SAAS
CREATE TABLE assinaturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL UNIQUE,
    data_inicio DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    ciclo ENUM('Mensal', 'Anual') NOT NULL DEFAULT 'Mensal',
    status ENUM('Ativa', 'Vencida', 'Cancelada') NOT NULL DEFAULT 'Ativa',
    CONSTRAINT fk_assinaturas_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 25. HISTÓRICO DE PAGAMENTO DE ASSINATURA SAAS
CREATE TABLE pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_gateway VARCHAR(50) NOT NULL, -- MercadoPago, Stripe
    transacao_id VARCHAR(100) UNIQUE NOT NULL,
    comprovante_url VARCHAR(255) NULL,
    CONSTRAINT fk_pagamentos_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 26. TABELA DE CONFIGURAÇÕES GERAIS DE MONITORAMENTO
CREATE TABLE configuracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    chave_parametro VARCHAR(100) NOT NULL,
    valor_parametro TEXT NULL,
    CONSTRAINT uq_empresa_param UNIQUE (empresa_id, chave_parametro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 27. TABELA DE AUDITORIA COMPLETA (HISTÓRICO ATIVIDADE HUMANA)
CREATE TABLE auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    empresa_id INT NOT NULL,
    modulo_afetado VARCHAR(100) NOT NULL,
    acao_detalhe TEXT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_auditoria_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- SEÇÃO DE CRIAÇÃO DOS ÍNDICES DE PERFORMANCE E FOREIGN KEYS
-- ====================================================================

CREATE INDEX idx_empresas_status ON empresas(status);
CREATE INDEX idx_centrais_conta ON centrais(conta_preconfigurada);
CREATE INDEX idx_eventos_central ON eventos(central_id);
CREATE INDEX idx_eventos_empresa ON eventos(empresa_id);
CREATE INDEX idx_eventos_status ON eventos(status_tratamento);
CREATE INDEX idx_atendimentos_evento ON atendimentos(evento_id);

-- ====================================================================
-- VIEWS ÚTEIS E PROCEDURES DE ANALYTICS
-- ====================================================================

-- View para listagem consolidada de eventos e tratamento ativo de operadores
CREATE OR REPLACE VIEW view_eventos_pendentes_operacao AS
SELECT 
    e.codigo AS codigo_evento,
    e.descricao AS descricao_alarme,
    e.data_hora AS data_disparo,
    c.nome_identificacao AS local_identificado,
    cli.nome AS nome_proprietario,
    e.status_tratamento,
    emp.nome_fantasia AS tenant_empresa
FROM eventos e
JOIN centrais c ON e.central_id = c.id
JOIN clientes cli ON c.cliente_id = cli.id
JOIN empresas emp ON e.empresa_id = emp.id
WHERE e.status_tratamento != 'RESOLVIDO';

SET FOREIGN_KEY_CHECKS = 1;
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Credenciais de Conexão Ativa HUD */}
      <div className="bg-black border-2 border-emerald-500 rounded-xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.3)] space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-920 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h4 className="text-white text-xs font-mono font-bold uppercase tracking-widest">
              Conexão Homologada cPanel
            </h4>
          </div>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono uppercase">
            Sincronizado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-neutral-900 border border-emerald-950 rounded">
            <span className="text-neutral-500 uppercase block text-[9px]">Banco de Dados / User</span>
            <span className="text-emerald-400 font-bold block mt-1 truncate">wluyuveu_alienlarm</span>
          </div>
          <div className="p-3 bg-neutral-900 border border-emerald-950 rounded">
            <span className="text-neutral-500 uppercase block text-[9px]">Senha do Banco</span>
            <span className="text-emerald-400 font-bold block mt-1 select-all">Rgcl02212608@</span>
          </div>
          <div className="p-3 bg-neutral-900 border border-emerald-950 rounded">
            <span className="text-neutral-500 uppercase block text-[9px]">Configuração Física</span>
            <span className="text-neutral-300 block mt-1 font-bold">Arquivo conexao_db.sql Criado</span>
          </div>
        </div>

        <p className="text-[10.5px] text-neutral-400 font-mono leading-relaxed bg-[#050505] p-3 border border-emerald-950 rounded">
          💡 <span className="text-emerald-400 font-bold">Dica do Administrador:</span> O script de criação de permissões e as credenciais foram gravados com sucesso na raiz do projeto como <span className="text-emerald-400 font-bold">conexao_db.sql</span>. Use-o para subir a estrutura relacional do SaaS no phpMyAdmin.
        </p>
      </div>

      {/* DB Summary header */}
      <div className="bg-neutral-900 border border-emerald-950 p-4 rounded-xl flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="text-emerald-500 w-4.5 h-4.5" /> DDL SQL do Banco de Dados Relacional
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Gerador automático de tabelas homologadas em cPanel/MySQL para o produto AlienLarm Enterprise.</p>
        </div>

        <button
          onClick={copyToClipboard}
          className="px-4 py-2 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-400 font-mono text-xs uppercase rounded flex items-center gap-1.5 cursor-pointer transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" /> Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copiar SQL
            </>
          )}
        </button>
      </div>

      <div className="bg-[#050505] border border-emerald-950 rounded-xl p-5 relative overflow-hidden">
        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono uppercase pb-3 border-b border-emerald-950/60 mb-4">
          <span className="flex items-center gap-1"><Terminal className="text-emerald-500 w-4 h-4" /> mysql -u alienlarm -p &lt; schema.sql</span>
          <span>Engine InnoDB // UTF8MB4</span>
        </div>

        {/* Read-only styled scrollable SQL container */}
        <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre pr-2 font-mono scrollbar-thin scrollbar-thumb-emerald-950 scrollbar-track-transparent">
          {sqlSchema}
        </pre>
      </div>

      <div className="p-4 rounded-xl bg-neutral-900/60 border border-emerald-950/40 text-xs text-neutral-400 space-y-2">
        <h5 className="text-white uppercase font-bold font-mono text-xs block">// Requisitos de Produção do DBA</h5>
        <p className="leading-relaxed">
          1. Todas as tabelas possuem <span className="text-emerald-400">UUID (CHAR 36)</span> para chaves externas seguras do frontend e de APIs externas, além de IDs INTEGER incrementais locais para performar indexações rápidas.
        </p>
        <p className="leading-relaxed">
          2. A view especial <span className="text-emerald-400">view_eventos_pendentes_operacao</span> acelera consultas complexas do painel operacional reduzindo o overhead de junções de tabelas em ambientes de pico de telemetria.
        </p>
      </div>

    </div>
  );
}
