
import { Category, CategoryGroup, TransactionType } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Rendas/Casa', icon: 'fa-house', color: '#3B82F6', group: CategoryGroup.NEED, budget: 800 },
  { id: '2', name: 'Alimentação', icon: 'fa-utensils', color: '#EF4444', group: CategoryGroup.NEED, budget: 300 },
  { id: '3', name: 'Transportes', icon: 'fa-bus', color: '#F59E0B', group: CategoryGroup.NEED, budget: 100 },
  { id: '4', name: 'Lazer', icon: 'fa-gamepad', color: '#10B981', group: CategoryGroup.WANT, budget: 200 },
  { id: '5', name: 'Saúde', icon: 'fa-heart-pulse', color: '#EC4899', group: CategoryGroup.NEED, budget: 50 },
  { id: '6', name: 'Subscrições', icon: 'fa-tv', color: '#8B5CF6', group: CategoryGroup.WANT, budget: 50 },
  { id: '7', name: 'Poupança/Inv', icon: 'fa-piggy-bank', color: '#6366F1', group: CategoryGroup.SAVING, budget: 500 },
  { id: 'income-cat', name: 'Salário/Rendimento', icon: 'fa-money-bill-trend-up', color: '#059669', group: CategoryGroup.INCOME, budget: 0 },
];

export const PAYMENT_METHODS = [
  'Cartão Débito',
  'Cartão Crédito',
  'Dinheiro',
  'MB Way',
  'Transferência'
];

export const INITIAL_TRANSACTIONS = [
  { id: 't1', amount: 2500, type: TransactionType.INCOME, categoryId: 'income-cat', date: new Date().toISOString().split('T')[0], method: 'Transferência', description: 'Salário Mensal', isRecurring: true },
  { id: 't2', amount: 750, type: TransactionType.EXPENSE, categoryId: '1', date: new Date().toISOString().split('T')[0], method: 'Transferência', description: 'Renda Apartamento', isRecurring: true },
  { id: 't3', amount: 45.5, type: TransactionType.EXPENSE, categoryId: '2', date: new Date().toISOString().split('T')[0], method: 'MB Way', description: 'Continente Supermercado', isRecurring: false },
  { id: 't4', amount: 15.99, type: TransactionType.EXPENSE, categoryId: '6', date: new Date().toISOString().split('T')[0], method: 'Cartão Crédito', description: 'Netflix', isRecurring: true },
];
