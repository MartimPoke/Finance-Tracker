
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Transaction, Category, TransactionType, UserProfile } from '../types';
import TransactionList from './TransactionList';

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

interface HistoryViewProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  userProfile: UserProfile;
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions, categories, onDelete, userProfile }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const inc = filtered.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
    const exp = filtered.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
    return { inc, exp };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Year Picker */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <button onClick={() => setSelectedYear(y => y-1)} className={`hover:text-blue-600 ${userProfile.isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <span className={`text-xl font-black ${userProfile.isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedYear}</span>
        <button onClick={() => setSelectedYear(y => y+1)} className={`hover:text-blue-600 ${userProfile.isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Month Picker Horizontal */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1">
        {MONTHS.map((m, idx) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(idx)}
            className={`shrink-0 px-6 py-2 rounded-2xl text-xs font-black uppercase transition-all ${
              selectedMonth === idx 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : (userProfile.isDarkMode ? 'bg-[#1C1F23] border border-[#2A2E33] text-gray-600' : 'bg-white border border-gray-100 text-gray-400')
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Mini Stats Card */}
      <div className={`p-6 rounded-[2rem] flex justify-between items-center shadow-xl transition-all ${userProfile.isDarkMode ? 'bg-[#1C1F23] border border-[#2A2E33] text-white shadow-none' : 'bg-[#191C1F] text-white'}`}>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>Total Gastos</p>
          <p className="text-2xl font-black text-red-400">-{stats.exp.toFixed(2)}€</p>
        </div>
        <div className="text-right">
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>Entradas</p>
          <p className="text-2xl font-black text-green-400">+{stats.inc.toFixed(2)}€</p>
        </div>
      </div>

      {/* List */}
      <TransactionList transactions={filtered} categories={categories} onDelete={onDelete} userProfile={userProfile} />
    </div>
  );
};

export default HistoryView;
