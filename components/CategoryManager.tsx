
import React, { useState } from 'react';
import { Category, CategoryGroup } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (c: Category) => void;
  onUpdate: (id: string, updates: Partial<Category>) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAdd, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({
    name: '',
    group: CategoryGroup.WANT,
    budget: 0,
    color: '#6366F1'
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
    setNewCat({ name: '', group: CategoryGroup.WANT, budget: 0, color: '#6366F1' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Gerir Orçamentos e Categorias</h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <i className={`fa-solid ${showAdd ? 'fa-times' : 'fa-plus'}`}></i>
          {showAdd ? 'Cancelar' : 'Nova Categoria'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
              <input 
                type="text" 
                value={newCat.name} 
                onChange={e => setNewCat({...newCat, name: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Ginásio"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
              <select 
                value={newCat.group} 
                onChange={e => setNewCat({...newCat, group: e.target.value as CategoryGroup})}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={CategoryGroup.NEED}>Necessidade (50%)</option>
                <option value={CategoryGroup.WANT}>Desejo (30%)</option>
                <option value={CategoryGroup.SAVING}>Poupança (20%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget Mensal (€)</label>
              <input 
                type="number" 
                value={newCat.budget} 
                onChange={e => setNewCat({...newCat, budget: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold">Criar</button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.filter(c => c.group !== CategoryGroup.INCOME).map(cat => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
                  <i className={`fa-solid ${cat.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{cat.name}</h4>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    {cat.group === CategoryGroup.NEED ? 'Necessidade' : cat.group === CategoryGroup.WANT ? 'Desejo' : 'Poupança'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Budget Mensal</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    value={cat.budget}
                    onChange={e => onUpdate(cat.id, { budget: parseFloat(e.target.value) || 0 })}
                    className="flex-1 bg-gray-50 border-none rounded-lg px-3 py-1 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-200"
                  />
                  <span className="text-sm font-bold text-gray-400">€</span>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(color => (
                  <button 
                    key={color}
                    onClick={() => onUpdate(cat.id, { color })}
                    className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-125 ${cat.color === color ? 'border-gray-800' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
