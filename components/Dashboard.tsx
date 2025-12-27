
import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, Category, TransactionType, UserProfile } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  onAddClick: () => void;
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, categories, onAddClick, userProfile }) => {
  const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  const trendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return {
      name: d.toLocaleDateString('pt-PT', { weekday: 'short' }),
      val: transactions.filter(t => t.date === dateStr && t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0)
    };
  });

  const formatValue = (val: number) => {
    if (userProfile.hideBalance) return '••••';
    return val.toLocaleString('pt-PT', { style: 'currency', currency: userProfile.currency || 'EUR' });
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#191C1F] p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-gray-200"
      >
        <div className="relative z-10">
          <p className="text-gray-400 text-sm font-semibold mb-1">Total em conta</p>
          <h1 className="text-4xl font-black mb-6">
            {formatValue(balance)}
          </h1>
          <div className="flex gap-4">
            <button onClick={onAddClick} className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Add
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-paper-plane"></i> Enviar
            </button>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-40"></div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <i className="fa-solid fa-arrow-up text-sm"></i>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase">Entradas</span>
          <span className="text-lg font-black text-green-600">{formatValue(income)}</span>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <i className="fa-solid fa-arrow-down text-sm"></i>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase">Saídas</span>
          <span className="text-lg font-black text-red-600">{formatValue(expenses)}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
          Atividade Semanal
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-black">Gastos</span>
        </h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0075EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0075EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              {!userProfile.hideBalance && (
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#191C1F] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        {payload[0].value}€
                      </div>
                    );
                  }
                  return null;
                }} />
              )}
              <Area type="monotone" dataKey="val" stroke="#0075EB" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-800">Recentes</h3>
          <button className="text-xs font-bold text-blue-600">Histórico completo</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            return (
              <motion.div 
                key={t.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: cat?.color }}>
                     <i className={`fa-solid ${cat?.icon || 'fa-tag'}`}></i>
                   </div>
                   <div>
                     <p className="text-sm font-extrabold text-[#191C1F] truncate max-w-[120px]">{t.description}</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{cat?.name}</p>
                   </div>
                </div>
                <span className={`text-sm font-black ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-gray-900'}`}>
                  {userProfile.hideBalance ? '••••' : `${t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toFixed(2)}€`}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
