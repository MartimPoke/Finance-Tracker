
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Transaction, Category, TransactionType } from '../types';
import { PAYMENT_METHODS } from '../constants';

interface TransactionFormProps {
  onSubmit: (t: Transaction) => void;
  categories: Category[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, categories }) => {
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
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0 || !formData.categoryId || !formData.description.trim()) return;
    onSubmit({
      id: crypto.randomUUID(),
      amount: amount,
      type: formData.type,
      categoryId: formData.categoryId,
      date: formData.date,
      method: formData.method,
      description: formData.description.trim(),
      isRecurring: formData.isRecurring
    });
    // Reset form
    setFormData({
      amount: '',
      type: TransactionType.EXPENSE,
      categoryId: categories[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      method: PAYMENT_METHODS[0],
      description: '',
      isRecurring: false
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-gray-800">Novo Registo</h2>
      
      <div className="bg-gray-100 p-1.5 rounded-[1.5rem] flex">
        <button
          onClick={() => setFormData(f => ({ ...f, type: TransactionType.EXPENSE }))}
          className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${formData.type === TransactionType.EXPENSE ? 'bg-white shadow-sm text-red-600' : 'text-gray-400'}`}
        >
          Despesa
        </button>
        <button
          onClick={() => setFormData(f => ({ ...f, type: TransactionType.INCOME }))}
          className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${formData.type === TransactionType.INCOME ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`}
        >
          Receita
        </button>
      </div>

      <div className="text-center py-8">
        <input 
          type="number"
          value={formData.amount}
          onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))}
          placeholder="0.00"
          className="text-6xl font-black text-[#191C1F] w-full text-center bg-transparent border-none focus:ring-0 placeholder:text-gray-200"
        />
        <p className="text-sm font-bold text-gray-400 mt-2">EUR — Euro</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-tag"></i>
          </div>
          <select 
            value={formData.categoryId}
            onChange={e => setFormData(f => ({ ...f, categoryId: e.target.value }))}
            className="flex-1 bg-transparent border-none text-sm font-bold text-gray-800 focus:ring-0"
          >
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-comment-dots"></i>
          </div>
          <input 
            type="text"
            placeholder="O que compraste?"
            value={formData.description}
            onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
            className="flex-1 bg-transparent border-none text-sm font-bold text-gray-800 focus:ring-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-3xl border border-gray-100">
              <input type="date" value={formData.date} onChange={e => setFormData(f => ({...f, date: e.target.value}))} className="w-full bg-transparent border-none text-xs font-bold text-gray-800 focus:ring-0" />
           </div>
           <div className="bg-white p-4 rounded-3xl border border-gray-100">
              <select value={formData.method} onChange={e => setFormData(f => ({...f, method: e.target.value}))} className="w-full bg-transparent border-none text-xs font-bold text-gray-800 focus:ring-0">
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
           </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full bg-[#0075EB] text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-100 mt-4"
      >
        Confirmar
      </motion.button>
    </div>
  );
};

export default TransactionForm;
