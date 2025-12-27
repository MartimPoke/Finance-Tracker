
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, Category, TransactionType, UserProfile } from './types';
import { INITIAL_CATEGORIES, INITIAL_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryManager from './components/CategoryManager';
import SettingsView from './components/SettingsView';
import HistoryView from './components/HistoryView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'add' | 'categories' | 'more'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'João Silva',
    age: 28,
    job: 'Designer',
    currency: 'EUR',
    hideBalance: false
  });

  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('fintrack_transactions_v2');
      const savedCategories = localStorage.getItem('fintrack_categories_v2');
      const savedProfile = localStorage.getItem('fintrack_profile_v2');
      
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        if (Array.isArray(parsed)) setTransactions(parsed);
      }
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed)) setCategories(parsed);
      }
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed && typeof parsed === 'object') setUserProfile(parsed);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fintrack_transactions_v2', JSON.stringify(transactions));
    localStorage.setItem('fintrack_categories_v2', JSON.stringify(categories));
    localStorage.setItem('fintrack_profile_v2', JSON.stringify(userProfile));
  }, [transactions, categories, userProfile]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    setActiveTab('home');
  };
  
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  const initials = useMemo(() => {
    return userProfile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userProfile.name]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 19) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shrink-0">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <motion.div 
              key={initials}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 bg-[#0075EB] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-100"
            >
              {initials}
            </motion.div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{greeting},</p>
              <h2 className="text-xl font-extrabold text-[#191C1F]">{userProfile.name.split(' ')[0]}</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setUserProfile(p => ({ ...p, hideBalance: !p.hideBalance }))}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${userProfile.hideBalance ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}
            >
              <i className={`fa-solid ${userProfile.hideBalance ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100"
            >
              <i className="fa-solid fa-bell"></i>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'home' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'home' ? 10 : -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === 'home' && (
              <Dashboard 
                transactions={transactions} 
                categories={categories} 
                onAddClick={() => setActiveTab('add')} 
                userProfile={userProfile}
              />
            )}
            {activeTab === 'history' && (
              <HistoryView transactions={transactions} categories={categories} onDelete={deleteTransaction} />
            )}
            {activeTab === 'add' && (
              <div className="py-4">
                <TransactionForm onSubmit={addTransaction} categories={categories} />
              </div>
            )}
            {activeTab === 'categories' && (
              <CategoryManager 
                categories={categories} 
                onAdd={c => setCategories(prev => [...prev, c])} 
                onUpdate={(id, up) => setCategories(prev => prev.map(c => c.id === id ? {...c, ...up} : c))} 
              />
            )}
            {activeTab === 'more' && (
              <SettingsView 
                transactions={transactions} 
                setTransactions={setTransactions} 
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50">
        <NavButton icon="fa-house" label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavButton icon="fa-chart-line" label="Histórico" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('add')}
          className="w-14 h-14 bg-[#0075EB] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 -mt-12 border-4 border-white"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </motion.button>

        <NavButton icon="fa-layer-group" label="Categorias" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
        <NavButton icon="fa-user" label="Perfil" active={activeTab === 'more'} onClick={() => setActiveTab('more')} />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className={`text-xl transition-all duration-300 ${active ? 'text-[#0075EB]' : 'text-gray-400 group-hover:text-gray-600'}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${active ? 'text-[#0075EB]' : 'text-gray-400 group-hover:text-gray-600'}`}>
      {label}
    </span>
    {active && (
      <motion.div layoutId="navIndicator" className="w-1 h-1 bg-[#0075EB] rounded-full mt-1" />
    )}
  </button>
);

export default App;
