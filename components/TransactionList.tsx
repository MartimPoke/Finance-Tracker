
import React from 'react';
import { motion } from 'framer-motion';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  userProfile?: { isDarkMode: boolean };
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, onDelete, userProfile }) => {
  const isDarkMode = userProfile?.isDarkMode ?? false;
  
  const grouped = transactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const cardClass = isDarkMode ? 'bg-[#1C1F23] border-[#2A2E33]' : 'bg-white border-gray-100';

  return (
    <div className="space-y-6 pb-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 px-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
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
                  className={`p-4 rounded-[1.5rem] border flex items-center justify-between group relative overflow-hidden transition-colors ${cardClass}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div 
                      className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: cat?.color || '#ccc' }}
                    >
                      <i className={`fa-solid ${cat?.icon || 'fa-tag'} text-base`}></i>
                    </div>
                    <div className="min-w-0 flex-1 pr-2">
                      <h5 className={`text-sm font-extrabold truncate ${isDarkMode ? 'text-gray-200' : 'text-[#191C1F]'}`}>
                        {t.description}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-tight truncate ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{cat?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Container fixo para valor e botão para evitar quebra em ecrãs pequenos ou valores grandes */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-sm font-black tabular-nums ${t.type === TransactionType.INCOME ? 'text-green-600' : (isDarkMode ? 'text-white' : 'text-[#191C1F]')}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}{t.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}€
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Deseja eliminar este registo permanentemente?')) {
                          onDelete(t.id);
                        }
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                      aria-label="Eliminar"
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
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${isDarkMode ? 'bg-[#1C1F23] text-gray-700' : 'bg-gray-50 text-gray-300'}`}>
            <i className="fa-solid fa-receipt"></i>
          </div>
          <p className={`font-bold text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Sem movimentos para exibir.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
