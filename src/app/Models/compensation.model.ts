export interface Compensation {
  compensationId: string;
  amount: number;
  status: 'NOT_TRAITED' | 'TRAITED';
}