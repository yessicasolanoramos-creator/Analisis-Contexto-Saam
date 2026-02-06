
export type DofaType = 'F' | 'O' | 'D' | 'A';

export interface DofaAction {
  id: string;
  text: string;
  responsible: string;
  startDate: string;
  endDate: string;
  effectivenessFollowUp: string;
}

/**
 * Interface representing a predefined DOFA factor used in constants.ts
 */
export interface DofaFactor {
  id: string;
  type: DofaType;
  factor: string;
  description: string;
}

export interface DofaRecord {
  id: string;
  country: string;
  type: DofaType;
  factor: string;
  description: string;
  impact: number;
  user: string;
  timestamp: number;
  actions: DofaAction[];
}

export interface Country {
  name: string;
  code: string;
}
