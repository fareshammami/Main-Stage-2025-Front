// src/app/Models/user-indu-state.model.ts
export interface InduErrorInfo {
  amount: number;
  status?: string; // e.g., "TRAITÉ" or "NON_TRAITÉ"
  createdAt: string; // ISO date string
}

export interface CompensationInfo {
  amount: number;
  createdAt: string; // ISO date string
}

export interface UserInduState {
  userId: string;
  induErrors: any[];
  compensations: any[];
  totalHandledInduErrors: number;
  totalHandledCompensations: number;
  totalUntreatedInduErrors: number;
  totalUntreatedCompensations: number;
  netTotal: number;
}