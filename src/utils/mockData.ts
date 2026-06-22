import { Empresa, Plano, Usuario, Cliente, Central, Evento, Atendimento, AutomationRule, LogSistema } from '../types';

export const INITIAL_PLANOS: Plano[] = [
  {
    id: 1,
    nome: "Standard Cosmic",
    valor: 299.90,
    limiteCentrais: 50,
    limiteUsuarios: 10,
    recursos: ["Contact ID via TCP", "SIA DC-09", "Painel de Atendimento", "Aplicativo do Cliente (PWA)"]
  },
  {
    id: 2,
    nome: "SaaS Enterprise Pro",
    valor: 799.90,
    limiteCentrais: 500,
    limiteUsuarios: 50,
    recursos: ["Todos os protocolos", "Automatizador Inteligente (Engine)", "Suporte Técnico 24/7", "API de Chatbot WhatsApp", "IA AlienLarm Triage"]
  },
  {
    id: 3,
    nome: "Ultimate Nebula",
    valor: 1499.90,
    limiteCentrais: 2000,
    limiteUsuarios: 200,
    recursos: ["Acesso Geral Ilimitado", "White-Label Completo", "Engine Automática de Incidente IA", "Receivers Dedicados", "Backups Multi-Cloud"]
  }
];

export const INITIAL_EMPRESAS: Empresa[] = [
  {
    id: 1,
    uuid: "aeb6fb91-b3b0-4dbb-9721-3eefcdef6a4a",
    codigo: "EMP-000001",
    nomeFantasia: "Alpha Guard Monitoramento",
    razaoSocial: "Alpha Guard LTDA",
    cnpj: "12.345.678/0001-90",
    status: "Ativa",
    planoId: 2,
    criadoEm: "2026-01-10T12:00:00Z"
  },
  {
    id: 2,
    uuid: "cf99ca82-3db5-4bd4-b992-0effd192be03",
    codigo: "EMP-000002",
    nomeFantasia: "NovaSeg Monitoramento",
    razaoSocial: "Novo Milênio Tecnologia em Segurança",
    cnpj: "98.765.432/0001-01",
    status: "Ativa",
    planoId: 1,
    criadoEm: "2026-03-15T09:30:00Z"
  },
  {
    id: 3,
    uuid: "fde97bc2-df3e-4b67-aef8-6bde9a8c19ee",
    codigo: "EMP-000003",
    nomeFantasia: "Starlight Segurança Nuvem",
    razaoSocial: "Starlight Cloud Security SA",
    cnpj: "45.987.123/0002-12",
    status: "Suspensa",
    planoId: 3,
    criadoEm: "2026-04-01T15:20:00Z"
  }
];

export const INITIAL_USUARIOS: Usuario[] = [
  {
    id: 1,
    uuid: "usr-master-001",
    codigo: "USR-000001",
    nome: "Eng. Rafael - AlienLarm Arquiteto",
    email: "master@alienlarm.com",
    funcao: "MASTER",
    empresaId: null,
    status: "Ativo",
    telefone: "+55 (11) 99999-9999",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    uuid: "usr-admin-001",
    codigo: "USR-000002",
    nome: "Maurício Albuquerque",
    email: "admin@alphaguard.com",
    funcao: "ADMIN",
    empresaId: 1,
    status: "Ativo",
    telefone: "+55 (11) 98888-0001",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    uuid: "usr-tech-001",
    codigo: "USR-000003",
    nome: "Sandro Instalações",
    email: "sandro@tecnico.com",
    funcao: "TECNICO",
    empresaId: 1,
    status: "Ativo",
    telefone: "+55 (11) 97777-0002"
  },
  {
    id: 4,
    uuid: "usr-op-001",
    codigo: "USR-000004",
    nome: "Bárbara Oliveira (Central/Op)",
    email: "op@alphaguard.com",
    funcao: "OPERADOR",
    empresaId: 1,
    status: "Ativo",
    telefone: "+55 (11) 96666-0003"
  },
  {
    id: 5,
    uuid: "usr-client-001",
    codigo: "USR-000005",
    nome: "Renato Rezende (Indústria Metalúrgica)",
    email: "renato@metalurgicarezende.com.br",
    funcao: "CLIENTE",
    empresaId: 1,
    status: "Ativo",
    telefone: "+55 (11) 95555-0004"
  }
];

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 1,
    uuid: "cli-0001",
    codigo: "CLI-000001",
    nome: "Indústria Rezende Metal",
    cnpjCpf: "11.222.333/0001-44",
    email: "fiscal@rezendemetal.com",
    telefone: "+55 (11) 3455-8900",
    empresaId: 1,
    endereco: {
      rua: "Av. Industrial das Nações",
      numero: "1500",
      bairro: "Distrito Industrial",
      cidade: "São Caetano do Sul",
      estado: "SP",
      cep: "09540-000"
    }
  },
  {
    id: 2,
    uuid: "cli-0002",
    codigo: "CLI-000002",
    nome: "Supermercados Estrela Cadente",
    cnpjCpf: "22.333.444/0001-55",
    email: "segurança@estrela.com.br",
    telefone: "+55 (11) 4899-7700",
    empresaId: 1,
    endereco: {
      rua: "Rua do Comércio de Ouro",
      numero: "45",
      bairro: "Centro",
      cidade: "Santo André",
      estado: "SP",
      cep: "09015-000"
    }
  },
  {
    id: 3,
    uuid: "cli-0003",
    codigo: "CLI-000003",
    nome: "Residencial Dr. Pedro Castilho",
    cnpjCpf: "098.765.432-11",
    email: "pedro.cast@med.com",
    telefone: "+55 (11) 98111-2233",
    empresaId: 1,
    endereco: {
      rua: "Alameda das Orquídeas Flutuantes",
      numero: "210",
      bairro: "Solaris Condomínio",
      cidade: "Barueri",
      estado: "SP",
      cep: "06454-000"
    }
  }
];

export const INITIAL_CENTRAIS: Central[] = [
  {
    id: 1,
    uuid: "ctr-0001",
    codigo: "CTR-000001",
    clienteId: 1,
    empresaId: 1,
    nomeIdentificacao: "Central Galpão Principal - Rezende Metal",
    fabricante: "Intelbras",
    modelo: "AMT 4010 Smart",
    protocolo: "ContactID",
    contaPreconfigurada: "4815",
    statusConexao: "ONLINE",
    statusAlarme: "ARMADO",
    zonas: [
      { numero: 1, nome: "Portão de Entrada", status: "Normal" },
      { numero: 2, nome: "Estoque de Cobre", status: "Normal" },
      { numero: 3, nome: "Sensor de Incêndio / Lab", status: "Normal" },
      { numero: 4, nome: "Janela Escritório", status: "Normal" }
    ],
    ultimoHeartbeat: "2026-06-22T15:25:30Z"
  },
  {
    id: 2,
    uuid: "ctr-0002",
    codigo: "CTR-000002",
    clienteId: 2,
    empresaId: 1,
    nomeIdentificacao: "Fatiado & Depósito - Estrela Cadente",
    fabricante: "Paradox",
    modelo: "Spectra SP6000",
    protocolo: "SIA_DC09",
    contaPreconfigurada: "1623",
    statusConexao: "ONLINE",
    statusAlarme: "DESARMADO",
    zonas: [
      { numero: 1, nome: "Presença Corredores", status: "Normal" },
      { numero: 2, nome: "Câmera de Temperatura Frigo", status: "Normal" },
      { numero: 3, nome: "Detector de Quebra Vidro", status: "Normal" }
    ],
    ultimoHeartbeat: "2026-06-22T15:27:00Z"
  }
];

export const INITIAL_EVENTOS: Evento[] = [
  {
    id: 1,
    uuid: "evt-0001",
    codigo: "EVT-000001",
    centralId: 1,
    empresaId: 1,
    codigoEvento: "1130", // Zone fire alarm
    descricao: "Disparo do Alarme de Incêndio - Zona 3 Lab",
    criticidade: "CRITICA",
    dataHora: "2026-06-22T15:10:00Z",
    statusTratamento: "EM_TRATAMENTO",
    origemPacote: "[4815 18 1 1130 01 003]"
  },
  {
    id: 2,
    uuid: "evt-0002",
    codigo: "EVT-000002",
    centralId: 1,
    empresaId: 1,
    codigoEvento: "3401", // Armed
    descricao: "Central Armada com Sucesso - Usuário 01",
    criticidade: "BAIXA",
    dataHora: "2026-06-22T14:45:00Z",
    statusTratamento: "RESOLVIDO",
    origemPacote: "[4815 18 1 3401 01 001]"
  },
  {
    id: 3,
    uuid: "evt-0003",
    codigo: "EVT-000003",
    centralId: 2,
    empresaId: 1,
    codigoEvento: "1121", // Panic alarm
    descricao: "Pânico Silencioso Acionado - Teclado Secundário",
    criticidade: "CRITICA",
    dataHora: "2026-06-22T15:22:15Z",
    statusTratamento: "PENDENTE",
    origemPacote: "SIA #1623 L0 PA01"
  }
];

export const INITIAL_ATENDIMENTOS: Atendimento[] = [
  {
    id: 1,
    uuid: "atd-0001",
    codigo: "ATD-000001",
    eventoId: 1,
    operadorId: 4,
    dataHoraInicio: "2026-06-22T15:11:15Z",
    anotacoes: [
      "Operador Barbara iniciou o contato com o técnico de brigada local.",
      "Ligação efetuada para o responsável da metalúrgica Eng. Renato, que informou estar a caminho da sala de engenharia."
    ],
    acoesExecutadas: [
      "Acionamento por Telefone",
      "Solicitação de confirmação de fumaça",
      "Envio de SMS de alerta de sinistro"
    ],
    status: "Aberto"
  }
];

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 1,
    nome: "Alerta Integrado de Incêndio",
    empresaId: 1,
    gatilhoEvento: "Disparo de Incêndio (1130)",
    condicao: "Sempre Ativo",
    acaoEmail: true,
    emailDestinatario: "brigadadeincendio@rezendemetal.com",
    acaoSMS: true,
    acaoPush: true,
    acaoIA: true,
    ativo: true
  },
  {
    id: 2,
    nome: "Pânico Silencioso - Despacho Máximo",
    empresaId: 1,
    gatilhoEvento: "Pânico Silencioso (1121)",
    condicao: "Sempre Ativo",
    acaoEmail: false,
    emailDestinatario: "gerente@lojasestrela.com",
    acaoSMS: true,
    acaoPush: true,
    acaoIA: false,
    ativo: true
  }
];

export const INITIAL_LOGS: LogSistema[] = [
  {
    id: 1,
    dataHora: "2026-06-22T15:28:00Z",
    tipo: "LOGIN",
    usuario: "master@alienlarm.com",
    ip: "177.34.22.109",
    descricao: "Autenticação bem sucedida - JWT Gerado"
  },
  {
    id: 2,
    dataHora: "2026-06-22T15:27:12Z",
    tipo: "RECEIVER",
    usuario: "RECEIVER_NODEJS",
    ip: "10.0.0.4",
    descricao: "Pacote SIA recebido da Central 1623: 'SIA #1623 L0 PA01' (Duração: 8ms)"
  },
  {
    id: 3,
    dataHora: "2026-06-22T15:25:30Z",
    tipo: "RECEIVER",
    usuario: "RECEIVER_NODEJS",
    ip: "10.0.0.4",
    descricao: "Pacote ContactID recebido da Central 4815: '4815 18 1 1130 01 003' (Duração: 11ms)"
  },
  {
    id: 4,
    dataHora: "2026-06-22T15:20:05Z",
    tipo: "AUDITORIA",
    usuario: "admin@alphaguard.com",
    ip: "177.34.22.110",
    descricao: "Empresa cadastrou novo cliente: CLI-000003"
  }
];
