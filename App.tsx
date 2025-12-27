
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, Category, TransactionType, UserProfile } from './types';
import { INITIAL_CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import CategoryManager from './components/CategoryManager';
import SettingsView from './components/SettingsView';
import HistoryView from './components/HistoryView';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('fintrack_active_user'));
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'add' | 'categories' | 'more'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Utilizador',
    age: 25,
    job: 'Financista',
    currency: 'EUR',
    hideBalance: false,
    isDarkMode: false
  });

  useEffect(() => {
    if (currentUser) {
      const userKey = `fintrack_data_${currentUser}`;
      const savedData = localStorage.getItem(userKey);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setTransactions(parsed.transactions || []);
        setCategories(parsed.categories || INITIAL_CATEGORIES);
        setUserProfile(parsed.profile || { ...userProfile, name: currentUser });
      } else {
        // NOVO UTILIZADOR: Começa com TUDO A ZEROS
        setTransactions([]); 
        setCategories(INITIAL_CATEGORIES);
        setUserProfile({ 
          ...userProfile, 
          name: currentUser.charAt(0).toUpperCase() + currentUser.slice(1) 
        });
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userKey = `fintrack_data_${currentUser}`;
      const dataToSave = {
        transactions,
        categories,
        profile: userProfile
      };
      localStorage.setItem(userKey, JSON.stringify(dataToSave));
    }
  }, [transactions, categories, userProfile, currentUser]);

  const handleLogin = (username: string, password?: string) => {
    const userKey = `fintrack_data_${username}`;
    const savedData = localStorage.getItem(userKey);
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.profile?.password && parsed.profile.password !== password) {
        alert("Palavra-passe incorreta!");
        return;
      }
    }
    
    if (!savedData && password) {
      setUserProfile(prev => ({ 
        ...prev, 
        name: username.charAt(0).toUpperCase() + username.slice(1), 
        password 
      }));
    }

    localStorage.setItem('fintrack_active_user', username);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('fintrack_active_user');
    setCurrentUser(null);
    setActiveTab('home');
  };

  const initials = useMemo(() => {
    return userProfile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userProfile.name]);

  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className={`flex flex-col h-screen max-w-lg mx-auto shadow-2xl relative overflow-hidden transition-colors duration-500 ${userProfile.isDarkMode ? 'bg-[#0A0C0E] text-white' : 'bg-white text-[#191C1F]'}`}>
      <header className={`px-6 pt-12 pb-6 shrink-0 transition-colors ${userProfile.isDarkMode ? 'bg-[#0A0C0E]' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <motion.div 
              key={initials}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-10 h-10 bg-[#0075EB] rounded-full flex items-center justify-center text-white font-bold text-lg transition-all ${userProfile.isDarkMode ? 'shadow-none' : 'shadow-lg shadow-blue-100'}`}
            >
              {initials}
            </motion.div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${userProfile.isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Olá,</p>
              <h2 className="text-xl font-extrabold">{userProfile.name.split(' ')[0]}</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setUserProfile(p => ({ ...p, hideBalance: !p.hideBalance }))}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${userProfile.isDarkMode ? (userProfile.hideBalance ? 'bg-blue-900/40 text-blue-400' : 'bg-[#1C1F23] text-gray-500') : (userProfile.hideBalance ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400')}`}
            >
              <i className={`fa-solid ${userProfile.hideBalance ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${userProfile.isDarkMode ? 'bg-[#1C1F23] border-[#2A2E33] text-red-400' : 'bg-red-50 border-red-100 text-red-500'}`}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && <Dashboard transactions={transactions} categories={categories} onAddClick={() => setActiveTab('add')} userProfile={userProfile} />}
            {activeTab === 'history' && <HistoryView transactions={transactions} categories={categories} onDelete={(id) => setTransactions(prev => prev.filter(t => t.id !== id))} userProfile={userProfile} />}
            {activeTab === 'add' && <div className="py-4"><TransactionForm onSubmit={(t) => {setTransactions(prev => [t, ...prev]); setActiveTab('home');}} categories={categories} userProfile={userProfile} /></div>}
            {activeTab === 'categories' && <CategoryManager categories={categories} onAdd={c => setCategories(prev => [...prev, c])} onUpdate={(id, up) => setCategories(prev => prev.map(c => c.id === id ? {...c, ...up} : c))} userProfile={userProfile} />}
            {activeTab === 'more' && <SettingsView transactions={transactions} setTransactions={setTransactions} userProfile={userProfile} setUserProfile={setUserProfile} onLogout={handleLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 max-w-lg mx-auto border-t transition-all z-50 px-6 py-4 flex justify-between items-center ${userProfile.isDarkMode ? 'bg-[#0A0C0E]/80 border-[#1C1F23]' : 'bg-white/80 border-gray-100'} backdrop-blur-xl`}>
        <NavButton icon="fa-house" label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} isDarkMode={userProfile.isDarkMode} />
        <NavButton icon="fa-chart-line" label="Histórico" active={activeTab === 'history'} onClick={() => setActiveTab('history')} isDarkMode={userProfile.isDarkMode} />
        
        <motion.button 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setActiveTab('add')} 
          className={`w-14 h-14 bg-[#0075EB] rounded-2xl flex items-center justify-center text-white -mt-12 border-4 transition-all ${userProfile.isDarkMode ? 'border-[#0A0C0E] shadow-none' : 'border-white shadow-xl shadow-blue-200'}`}
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </motion.button>

        <NavButton icon="fa-layer-group" label="Categorias" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} isDarkMode={userProfile.isDarkMode} />
        <NavButton icon="fa-user" label="Perfil" active={activeTab === 'more'} onClick={() => setActiveTab('more')} isDarkMode={userProfile.isDarkMode} />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void; isDarkMode: boolean }> = ({ icon, label, active, onClick, isDarkMode }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className={`text-xl transition-all ${active ? 'text-[#0075EB]' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')}`}><i className={`fa-solid ${icon}`}></i></div>
    <span className={`text-[10px] font-bold ${active ? 'text-[#0075EB]' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')}`}>{label}</span>
  </button>
);

export default App;
