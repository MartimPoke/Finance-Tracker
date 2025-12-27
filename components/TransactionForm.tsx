
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Transaction, Category, TransactionType, UserProfile } from '../types';
import { PAYMENT_METHODS } from '../constants';

interface TransactionFormProps {
  onSubmit: (t: Transaction) => void;
  categories: Category[];
  userProfile?: UserProfile;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, categories, userProfile }) => {
  const isDarkMode = userProfile?.isDarkMode ?? false;
  
  const [formData, setFormData] = useState({
    amount: '',
    type: TransactionType.EXPENSE,
    categoryId: categories[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    method: PAYMENT_METHODS[0],
    description: '',
    isRecurring: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Apenas valor e categoria são obrigatórios
    if (!formData.amount || !formData.categoryId) {
      alert("Por favor, introduza um valor e selecione uma categoria.");
      return;
    }
    
    onSubmit({
      id: crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      categoryId: formData.categoryId,
      date: formData.date,
      method: formData.method,
      // Descrição agora é verdadeiramente opcional
      description: formData.description.trim() || (formData.type === TransactionType.INCOME ? 'Receita' : 'Despesa'),
      isRecurring: formData.isRecurring
    });
  };

  const inputBg = isDarkMode ? 'bg-[#1C1F23] border-[#2A2E33]' : 'bg-white border-gray-100';

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Novo Registo</h2>
      
      <div className={`p-1.5 rounded-[1.5rem] flex transition-colors ${isDarkMode ? 'bg-[#1C1F23]' : 'bg-gray-100'}`}>
        <button
          onClick={() => setFormData(f => ({ ...f, type: TransactionType.EXPENSE }))}
          className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${formData.type === TransactionType.EXPENSE ? (isDarkMode ? 'bg-[#2A2E33] text-red-400' : 'bg-white shadow-sm text-red-600') : 'text-gray-400'}`}
        >
          Despesa
        </button>
        <button
          onClick={() => setFormData(f => ({ ...f, type: TransactionType.INCOME }))}
          className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${formData.type === TransactionType.INCOME ? (isDarkMode ? 'bg-[#2A2E33] text-green-400' : 'bg-white shadow-sm text-green-600') : 'text-gray-400'}`}
        >
          Receita
        </button>
      </div>

      <div className="text-center py-8">
        <input 
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))}
          placeholder="0.00"
          className={`text-6xl font-black w-full text-center bg-transparent border-none focus:ring-0 transition-colors ${isDarkMode ? 'text-white placeholder:text-gray-800' : 'text-[#191C1F] placeholder:text-gray-200'}`}
        />
        <p className={`text-sm font-bold mt-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>EUR — Euro</p>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-3xl border flex items-center gap-4 transition-colors ${inputBg}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-[#2A2E33] text-gray-600' : 'bg-gray-50 text-gray-400'}`}>
            <i className="fa-solid fa-tag"></i>
          </div>
          <select 
            value={formData.categoryId}
            onChange={e => setFormData(f => ({ ...f, categoryId: e.target.value }))}
            className={`flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
          >
            {categories.map(c => <option key={c.id} value={c.id} className={isDarkMode ? 'bg-[#1C1F23]' : ''}>{c.name}</option>)}
          </select>
        </div>

        <div className={`p-4 rounded-3xl border flex items-center gap-4 transition-colors ${inputBg}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-[#2A2E33] text-gray-600' : 'bg-gray-50 text-gray-400'}`}>
            <i className="fa-solid fa-comment-dots"></i>
          </div>
          <input 
            type="text"
            placeholder="Nota opcional (ex: Almoço)"
            value={formData.description}
            onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
            className={`flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 ${isDarkMode ? 'text-gray-200 placeholder:text-gray-700' : 'text-gray-800 placeholder:text-gray-300'}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className={`p-4 rounded-3xl border transition-colors ${inputBg}`}>
              <input type="date" value={formData.date} onChange={e => setFormData(f => ({...f, date: e.target.value}))} className={`w-full bg-transparent border-none text-xs font-bold focus:ring-0 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />
           </div>
           <div className={`p-4 rounded-3xl border transition-colors ${inputBg}`}>
              <select value={formData.method} onChange={e => setFormData(f => ({...f, method: e.target.value}))} className={`w-full bg-transparent border-none text-xs font-bold focus:ring-0 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m} className={isDarkMode ? 'bg-[#1C1F23]' : ''}>{m}</option>)}
              </select>
           </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full bg-[#0075EB] text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-900/20 mt-4 active:scale-95 transition-all"
      >
        Confirmar Registo
      </motion.button>
    </div>
  );
};

export default TransactionForm;
