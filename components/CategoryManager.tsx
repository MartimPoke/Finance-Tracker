
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, CategoryGroup, UserProfile } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (c: Category) => void;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  userProfile?: UserProfile;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAdd, onUpdate, userProfile }) => {
  const isDarkMode = userProfile?.isDarkMode ?? false;
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({
    name: '',
    group: CategoryGroup.WANT,
    budget: 0,
    color: '#0075EB'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) return;
    onAdd({
      id: crypto.randomUUID(),
      name: newCat.name,
      icon: 'fa-tag',
      color: newCat.color,
      group: newCat.group,
      budget: newCat.budget
    });
    setNewCat({ name: '', group: CategoryGroup.WANT, budget: 0, color: '#0075EB' });
    setShowAdd(false);
  };

  const adjustBudget = (id: string, current: number, delta: number) => {
    onUpdate(id, { budget: Math.max(0, current + delta) });
  };

  const cardClass = isDarkMode ? 'bg-[#1C1F23] border-[#2A2E33]' : 'bg-white border-gray-100';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center px-1">
        <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Orçamentos</h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showAdd ? (isDarkMode ? 'bg-[#1C1F23] text-gray-700' : 'bg-gray-100 text-gray-400') : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'}`}
        >
          <i className={`fa-solid ${showAdd ? 'fa-xmark' : 'fa-plus'}`}></i>
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd} 
            className={`p-6 rounded-[2rem] border overflow-hidden space-y-4 transition-colors ${isDarkMode ? 'bg-[#1C1F23] border-blue-900/40' : 'bg-white border-blue-100 shadow-xl shadow-blue-50'}`}
          >
            <input 
              type="text" 
              value={newCat.name} 
              onChange={e => setNewCat({...newCat, name: e.target.value})}
              className={`w-full px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold ${isDarkMode ? 'bg-[#2A2E33] text-white placeholder:text-gray-700' : 'bg-gray-50 text-gray-800'}`}
              placeholder="Nome da categoria (ex: Ginásio)"
            />
            <div className="grid grid-cols-2 gap-3">
              <select 
                value={newCat.group} 
                onChange={e => setNewCat({...newCat, group: e.target.value as CategoryGroup})}
                className={`rounded-2xl border-none px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-[#2A2E33] text-gray-300' : 'bg-gray-50 text-gray-700'}`}
              >
                <option value={CategoryGroup.NEED}>Necessidade</option>
                <option value={CategoryGroup.WANT}>Desejo</option>
                <option value={CategoryGroup.SAVING}>Poupança</option>
              </select>
              <input 
                type="number" 
                placeholder="Budget (€)"
                value={newCat.budget || ''} 
                onChange={e => setNewCat({...newCat, budget: parseFloat(e.target.value) || 0})}
                className={`rounded-2xl border-none px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-[#2A2E33] text-white' : 'bg-gray-50 text-gray-800'}`}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Criar Categoria</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {categories.filter(c => c.group !== CategoryGroup.INCOME).map(cat => (
          <motion.div 
            layout
            key={cat.id} 
            className={`p-4 rounded-[1.8rem] border flex items-center justify-between group transition-colors ${cardClass}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: cat.color }}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <div>
                <h4 className={`font-extrabold text-sm ${isDarkMode ? 'text-gray-200' : 'text-[#191C1F]'}`}>{cat.name}</h4>
                <span className={`text-[9px] uppercase font-black tracking-widest ${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`}>
                  {cat.group === CategoryGroup.NEED ? '50% Necessidade' : cat.group === CategoryGroup.WANT ? '30% Desejo' : '20% Poupança'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center p-1 rounded-xl border transition-colors ${isDarkMode ? 'bg-[#0A0C0E] border-[#2A2E33]' : 'bg-gray-50 border-gray-100'}`}>
                <button 
                  onClick={() => adjustBudget(cat.id, cat.budget, -10)}
                  className={`w-7 h-7 flex items-center justify-center transition-colors ${isDarkMode ? 'text-gray-700 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <i className="fa-solid fa-minus text-[10px]"></i>
                </button>
                
                <input 
                  type="number"
                  value={cat.budget}
                  onChange={e => onUpdate(cat.id, { budget: parseFloat(e.target.value) || 0 })}
                  className={`w-14 bg-transparent border-none text-center text-sm font-black text-blue-600 focus:ring-0 p-0 transition-colors`}
                />
                
                <button 
                  onClick={() => adjustBudget(cat.id, cat.budget, 10)}
                  className={`w-7 h-7 flex items-center justify-center transition-colors ${isDarkMode ? 'text-gray-700 hover:text-green-400' : 'text-gray-400 hover:text-green-500'}`}
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                </button>
              </div>
              <span className={`text-xs font-black mr-1 ${isDarkMode ? 'text-gray-800' : 'text-gray-300'}`}>€</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`p-6 rounded-[2rem] border transition-colors ${isDarkMode ? 'bg-blue-950/20 border-blue-900/30' : 'bg-blue-50/50 border-blue-100/50'}`}>
        <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-blue-600' : 'text-blue-400'}`}>Dica Pro</h5>
        <p className={`text-xs font-bold leading-relaxed ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          Ajusta os orçamentos clicando nos valores ou usando os botões +/- para incrementos de 10€.
        </p>
      </div>
    </div>
  );
};

export default CategoryManager;
