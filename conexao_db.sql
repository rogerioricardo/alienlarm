-- ====================================================================
-- ALIENLARM - CONFIGURAÇÃO DE CONEXÃO E GERENCIAMENTO DE BANCO DE DADOS
-- CREDENCIAIS HOMOLOGADAS DO SERVIDOR CPANEL DO CLIENTE
-- ====================================================================

-- 1. CRIAÇÃO DO BANCO DE DADOS (SE NECESSÁRIO EM SERVIDORES DEDICADOS)
CREATE DATABASE IF NOT EXISTS wluyuveu_alienlarm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wluyuveu_alienlarm;

-- 2. CRIAÇÃO DO USUÁRIO E ATRIBUIÇÃO DE PRIVILÉGIOS NO MYSQL
-- Para servidores cPanel, você geralmente realiza este passo pelo painel visual "Bancos de dados MySQL".
-- Caso possua acesso privilegiado de root/execução direta, execute as instruções abaixo:

-- Criar usuário com a senha configurada pelo engenheiro
CREATE USER IF NOT EXISTS 'wluyuveu_alienlarm'@'localhost' IDENTIFIED BY 'Rgcl02212608@';
CREATE USER IF NOT EXISTS 'wluyuveu_alienlarm'@'%' IDENTIFIED BY 'Rgcl02212608@';

-- Conceder todos os privilégios táticos e operacionais para a aplicação SaaS
GRANT ALL PRIVILEGES ON wluyuveu_alienlarm.* TO 'wluyuveu_alienlarm'@'localhost';
GRANT ALL PRIVILEGES ON wluyuveu_alienlarm.* TO 'wluyuveu_alienlarm'@'%';

-- Aplicar novas permissões imediatamente
FLUSH PRIVILEGES;

-- ====================================================================
-- ESTRUTURA INICIAL COMPATÍVEL COM O SISTEMA ALIENLARM ENTERPRISE
-- ====================================================================

-- 3. TABELA DE PLANOS DE ASSINATURA COBREGATEWAY
CREATE TABLE IF NOT EXISTS planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    limite_centrais INT NOT NULL DEFAULT 50,
    limite_usuarios INT NOT NULL DEFAULT 10,
    valor_mensal DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABELA DE COMPANHIAS MONITORADORAS (TENANTS)
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome_fantasia VARCHAR(150) NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('Ativa', 'Suspensa') NOT NULL DEFAULT 'Ativa',
    plano_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresas_planos FOREIGN KEY (plano_id) REFERENCES planos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    funcao ENUM('MASTER', 'ADMIN', 'TECNICO', 'OPERADOR', 'CLIENTE') NOT NULL,
    empresa_id INT NULL,
    telefone VARCHAR(25) NULL,
    status ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
    dois_fa_preparado TINYINT(1) DEFAULT 0,
    dois_fa_segredo VARCHAR(80) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- SEED DE DADOS INICIAIS DE TESTE COM CARGA HOMOLOGADA
-- ====================================================================

INSERT INTO planos (nome, limite_centrais, limite_usuarios, valor_mensal) VALUES 
('Lite SaaS', 15, 3, 149.90),
('Pro Receiver', 100, 15, 399.90),
('Enterprise Tactical', 9999, 100, 899.90)
ON DUPLICATE KEY UPDATE nome=VALUES(nome);

-- Exemplo de inserção para o admin master conectar no painel
-- Senha descriptografada para fins de demonstração: Rgcl02212608@ (representada por hash BCrypt em produção)
-- Certifique-se de configurar e executar as migrações conforme o Manual do Arquiteto.
