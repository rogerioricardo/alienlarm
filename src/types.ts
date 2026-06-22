export interface Empresa {
  id: number;
  uuid: string;
  codigo: string; // ex: EMP-000001
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  status: 'Ativa' | 'Suspensa';
  planoId: number;
  criadoEm: string;
}

export interface Plano {
  id: number;
  nome: string;
  valor: number;
  limiteCentrais: number;
  limiteUsuarios: number;
  recursos: string[];
}

export interface Usuario {
  id: number;
  uuid: string;
  codigo: string; // ex: USR-000001
  nome: string;
  email: string;
  funcao: 'MASTER' | 'ADMIN' | 'TECNICO' | 'OPERADOR' | 'CLIENTE';
  empresaId: number | null; // null se for MASTER ADMIN
  status: 'Ativo' | 'Inativo';
  telefone: string;
  avatar?: string;
}

export interface Cliente {
  id: number;
  uuid: string;
  codigo: string; // ex: CLI-000001
  nome: string;
  cnpjCpf: string;
  email: string;
  telefone: string;
  empresaId: number;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export interface Central {
  id: number;
  uuid: string;
  codigo: string; // ex: CTR-000001
  clienteId: number;
  empresaId: number;
  nomeIdentificacao: string;
  fabricante: string;
  modelo: string;
  protocolo: 'ContactID' | 'SIA_DC09' | 'JSON_REST' | 'MQTT';
  contaPreconfigurada: string; // código de 4 dígitos para a receptora
  statusConexao: 'ONLINE' | 'OFFLINE';
  statusAlarme: 'DESARMADO' | 'ARMADO' | 'DISPARADO';
  zonas: { numero: number; nome: string; status: 'Normal' | 'Aberta' | 'Violada' }[];
  ultimoHeartbeat: string;
}

export interface Evento {
  id: number;
  uuid: string;
  codigo: string; // ex: EVT-000001
  centralId: number;
  empresaId: number;
  codigoEvento: string; // ex: E130 (Disparo), R130 (Restauração)
  descricao: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  dataHora: string;
  statusTratamento: 'PENDENTE' | 'EM_TRATAMENTO' | 'RESOLVIDO';
  origemPacote: string; // raw ContactID / SIA
}

export interface Atendimento {
  id: number;
  uuid: string;
  codigo: string; // ex: ATD-000001
  eventoId: number;
  operadorId: number;
  dataHoraInicio: string;
  dataHoraFim?: string;
  anotacoes: string[];
  acoesExecutadas: string[];
  status: 'Aberto' | 'Finalizado';
}

export interface AutomationRule {
  id: number;
  nome: string;
  empresaId: number;
  gatilhoEvento: string; // ex: Disparo de Alarme, Queda de Energia, Bateria Baixa
  condicao: string; // ex: Fora de Horário, Setor 02, etc.
  acaoEmail: boolean;
  emailDestinatario: string;
  acaoSMS: boolean;
  acaoPush: boolean;
  acaoIA: boolean;
  ativo: boolean;
}

export interface LogSistema {
  id: number;
  dataHora: string;
  tipo: 'LOGIN' | 'RECEIVER' | 'SISTEMA' | 'AUDITORIA';
  usuario: string;
  ip: string;
  descricao: string;
}
