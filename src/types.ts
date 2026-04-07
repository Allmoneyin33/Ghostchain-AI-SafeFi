export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
}

export interface CashFlowStats {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
