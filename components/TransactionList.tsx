
import React from 'react';
import { motion } from 'framer-motion';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, onDelete }) => {
  // Group transactions by date
  const grouped = transactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6 pb-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
            {new Date(date).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h4>
          <div className="space-y-2">
            {grouped[date].map((t, idx) => {
              const cat = categories.find(c => c.id === t.categoryId);
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-4 rounded-[1.5rem] border border-gray-100 flex items-center justify-between group relative overflow-hidden active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: cat?.color || '#ccc' }}
                    >
                      <i className={`fa-solid ${cat?.icon || 'fa-tag'} text-lg`}></i>
                    </div>
                    <div>
                      <h5 className="text-sm font-extrabold text-[#191C1F]">{t.description}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{cat?.name}</span>
                        <span className="text-[8px] text-gray-300">•</span>
                        <span className="text-[10px] font-bold text-gray-400">{t.method}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-sm font-black ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-[#191C1F]'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}{t.amount.toFixed(2)}€
                    </span>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
      {transactions.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-2xl">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <p className="text-gray-400 font-bold text-sm">Sem movimentos para exibir.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
