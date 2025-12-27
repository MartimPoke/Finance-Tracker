
export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME'
}

export enum CategoryGroup {
  NEED = 'NEED',
  WANT = 'WANT',
  SAVING = 'SAVING',
  INCOME = 'INCOME'
}

export interface UserProfile {
  name: string;
  password?: string;
  age: number;
  job: string;
  currency: string;
  hideBalance: boolean;
  isDarkMode: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  group: CategoryGroup;
  budget: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  method: string;
  description: string;
  isRecurring: boolean;
}

export interface BudgetAlert {
  categoryId: string;
  categoryName: string;
  percentage: number;
  spent: number;
  limit: number;
}
