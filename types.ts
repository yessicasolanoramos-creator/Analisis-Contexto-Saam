
export type DofaType = 'F' | 'O' | 'D' | 'A';
export type ActionStatus = 'Abierta' | 'En proceso' | 'Cerrada' | 'Retrasada';

export interface DofaAction {
  id: string;
  text: string;
  responsible: string;
  startDate: string;
  endDate: string;
  effectivenessFollowUp: string;
}

export interface DofaRecord {
  id: string;
  country: string;
  axis: string;
  category: string;
  type: DofaType;
  factor: string;
  description: string;
  justification: string;
  impact: number;
  user: string;
  timestamp: number;
  actions: DofaAction[];
}

export interface Country {
  name: string;
  code: string;
}

export type IndicatorType = 'Estratégico' | 'Táctico' | 'Operativo';

export interface IndicatorRecord {
  id: string;
  processId: string;
  processName: string;
  type: IndicatorType;
  name: string;
  goal: string;
  formula: string;
  timestamp: number;
}
