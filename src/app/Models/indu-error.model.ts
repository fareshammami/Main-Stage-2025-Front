export interface InduError {
  induErrorId: string;
  amount: number;
  status: 'NOT_TRAITED' | 'TRAITED';
}