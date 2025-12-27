
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Transaction, Category, TransactionType, UserProfile } from '../types';
import TransactionList from './TransactionList';
import { exportTransactionsToPdf } from '../utils/exportPdf';

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const MONTHS_SHORT = [
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
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      })
      // Fix: Property 'date' does not exist on type 'Date'. 
      // Correctly compare ISO date strings directly from transaction objects for descending order.
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const inc = filtered.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
    const exp = filtered.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
    return { inc, exp };
  }, [filtered]);

  const handleExportPdf = () => {
    if (filtered.length === 0) return;
    exportTransactionsToPdf(filtered, {
      monthName: MONTHS[selectedMonth],
      year: selectedYear,
      userProfile,
      categories
    });
  };

  return (
    <div className="space-y-6">
      {/* Year Picker */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <button 
          onClick={() => setSelectedYear(y => y-1)} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${userProfile.isDarkMode ? 'text-gray-600 hover:bg-[#1C1F23]' : 'text-gray-300 hover:bg-gray-100'}`}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <span className={`text-xl font-black ${userProfile.isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedYear}</span>
        <button 
          onClick={() => setSelectedYear(y => y+1)} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${userProfile.isDarkMode ? 'text-gray-600 hover:bg-[#1C1F23]' : 'text-gray-300 hover:bg-gray-100'}`}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Month Picker Horizontal */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1">
        {MONTHS_SHORT.map((m, idx) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(idx)}
            className={`shrink-0 px-6 py-2 rounded-2xl text-xs font-black uppercase transition-all ${
              selectedMonth === idx 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : (userProfile.isDarkMode ? 'bg-[#1C1F23] border border-[#2A2E33] text-gray-600 hover:text-gray-400' : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-600')
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h3 className={`text-xs font-black uppercase tracking-widest ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          Histórico de Movimentos
        </h3>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleExportPdf}
          disabled={filtered.length === 0}
          className={`text-[10px] font-black uppercase flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-sm ${
            filtered.length === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : (userProfile.isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-900/40' : 'bg-blue-50 text-blue-600 border border-blue-100')
          }`}
        >
          <i className="fa-solid fa-file-pdf text-sm"></i> Exportar PDF
        </motion.button>
      </div>

      {/* Mini Stats Card */}
      <div className={`p-6 rounded-[2rem] flex justify-between items-center shadow-xl transition-all ${userProfile.isDarkMode ? 'bg-[#1C1F23] border border-[#2A2E33] text-white shadow-none' : 'bg-[#191C1F] text-white'}`}>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Gastos no Período</p>
          <p className="text-2xl font-black text-red-400">-{stats.exp.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}€</p>
        </div>
        <div className="text-right">
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Ganhos no Período</p>
          <p className="text-2xl font-black text-green-400">+{stats.inc.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}€</p>
        </div>
      </div>

      {/* List */}
      <TransactionList transactions={filtered} categories={categories} onDelete={onDelete} userProfile={userProfile} />
    </div>
  );
};

export default HistoryView;
