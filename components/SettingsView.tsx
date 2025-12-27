
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, UserProfile } from '../types';

interface SettingsViewProps {
  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ transactions, setTransactions, userProfile, setUserProfile }) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  const exportToCSV = () => {
    const headers = ['ID', 'Data', 'Descrição', 'Valor', 'Tipo', 'Método', 'Recorrente'];
    const rows = transactions.map(t => [t.id, t.date, t.description, t.amount, t.type, t.method, t.isRecurring ? 'Sim' : 'Não']);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `fintrack_export.csv`);
    link.click();
  };

  const menuItems = [
    { id: 'profile', label: 'Dados Pessoais', icon: 'fa-user', color: 'bg-blue-500' },
    { id: 'security', label: 'Segurança', icon: 'fa-shield-halved', color: 'bg-green-500' },
    { id: 'data', label: 'Dados e Exportação', icon: 'fa-database', color: 'bg-orange-500' },
    { id: 'about', label: 'Sobre a App', icon: 'fa-circle-info', color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4 text-blue-600 font-black shadow-inner">
           {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <h2 className="text-2xl font-black text-gray-800">{userProfile.name}</h2>
        <p className="text-sm font-bold text-gray-400">{userProfile.job} • {userProfile.age} anos</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
        {/* Profile Section */}
        <div className="p-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Perfil</h3>
          <div className="space-y-1">
            <SettingRow 
              label="Nome" 
              value={userProfile.name} 
              onEdit={() => setEditingField('name')} 
            />
            <SettingRow 
              label="Idade" 
              value={userProfile.age.toString()} 
              onEdit={() => setEditingField('age')} 
            />
            <SettingRow 
              label="Profissão" 
              value={userProfile.job} 
              onEdit={() => setEditingField('job')} 
            />
            <SettingRow 
              label="Moeda" 
              value={userProfile.currency} 
              onEdit={() => setEditingField('currency')} 
            />
          </div>
        </div>

        {/* Security / Privacy */}
        <div className="p-6 border-t border-gray-50">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Privacidade</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs">
                 <i className="fa-solid fa-eye-slash"></i>
               </div>
               <span className="text-sm font-bold text-gray-700">Esconder Saldos</span>
            </div>
            <button 
              onClick={() => setUserProfile(p => ({ ...p, hideBalance: !p.hideBalance }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${userProfile.hideBalance ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <motion.div 
                animate={{ x: userProfile.hideBalance ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Data Section */}
        <div className="p-6 border-t border-gray-50">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Gestão de Dados</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={exportToCSV}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 text-blue-600 rounded-3xl transition-transform active:scale-95"
            >
              <i className="fa-solid fa-file-export text-lg"></i>
              <span className="text-[10px] font-black uppercase">Exportar</span>
            </button>
            <button 
              onClick={() => { if(confirm('Apagar tudo?')) setTransactions([]) }}
              className="flex flex-col items-center gap-2 p-4 bg-red-50 text-red-600 rounded-3xl transition-transform active:scale-95"
            >
              <i className="fa-solid fa-trash text-lg"></i>
              <span className="text-[10px] font-black uppercase">Limpar</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-bold text-gray-300 py-4 uppercase tracking-tighter">FinTrack v2.4.0 — Made with ❤️</p>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingField && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center px-6 pb-12"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl"
            >
              <h4 className="text-xl font-black mb-6">Editar {editingField === 'name' ? 'Nome' : editingField === 'age' ? 'Idade' : editingField === 'job' ? 'Profissão' : 'Moeda'}</h4>
              <input 
                autoFocus
                type={editingField === 'age' ? 'number' : 'text'}
                defaultValue={userProfile[editingField as keyof UserProfile] as string}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    setUserProfile(p => ({ ...p, [editingField]: editingField === 'age' ? parseInt(val) : val }));
                    setEditingField(null);
                  }
                }}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-blue-500 mb-6"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setEditingField(null)}
                  className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold text-gray-400"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    const input = document.querySelector('input');
                    if (input) {
                       setUserProfile(p => ({ ...p, [editingField]: editingField === 'age' ? parseInt(input.value) : input.value }));
                    }
                    setEditingField(null);
                  }}
                  className="flex-1 bg-blue-600 py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-100"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingRow: React.FC<{ label: string; value: string; onEdit: () => void }> = ({ label, value, onEdit }) => (
  <button 
    onClick={onEdit}
    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left"
  >
    <span className="text-sm font-bold text-gray-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-black text-gray-800">{value}</span>
      <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
    </div>
  </button>
);

export default SettingsView;
