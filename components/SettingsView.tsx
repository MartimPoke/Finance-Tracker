
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, UserProfile } from '../types';

interface SettingsViewProps {
  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ transactions, setTransactions, userProfile, setUserProfile, onLogout }) => {
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

  const cardClass = userProfile.isDarkMode ? 'bg-[#1C1F23] border-[#2A2E33]' : 'bg-white border-gray-100';

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-4 text-blue-600 font-black shadow-inner transition-colors ${userProfile.isDarkMode ? 'bg-[#1C1F23]' : 'bg-gray-100'}`}>
           {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <h2 className={`text-2xl font-black ${userProfile.isDarkMode ? 'text-white' : 'text-gray-800'}`}>{userProfile.name}</h2>
        <p className={`text-sm font-bold ${userProfile.isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{userProfile.job} • {userProfile.age} anos</p>
      </div>

      <div className={`rounded-[2.5rem] border overflow-hidden transition-colors ${cardClass}`}>
        {/* Profile Section */}
        <div className="p-6">
          <h3 className={`text-xs font-black uppercase tracking-widest mb-4 px-2 ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Perfil</h3>
          <div className="space-y-1">
            <SettingRow label="Nome" value={userProfile.name} onEdit={() => setEditingField('name')} isDarkMode={userProfile.isDarkMode} />
            <SettingRow label="Idade" value={userProfile.age.toString()} onEdit={() => setEditingField('age')} isDarkMode={userProfile.isDarkMode} />
            <SettingRow label="Profissão" value={userProfile.job} onEdit={() => setEditingField('job')} isDarkMode={userProfile.isDarkMode} />
          </div>
        </div>

        {/* Appearance & Security */}
        <div className={`p-6 border-t ${userProfile.isDarkMode ? 'border-[#2A2E33]' : 'border-gray-50'}`}>
          <h3 className={`text-xs font-black uppercase tracking-widest mb-4 px-2 ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Aparência</h3>
          <ToggleRow label="Modo Noturno" icon="fa-moon" iconColor="bg-indigo-500" active={userProfile.isDarkMode} onToggle={() => setUserProfile(p => ({ ...p, isDarkMode: !p.isDarkMode }))} isDarkMode={userProfile.isDarkMode} />
          <div className="mt-4">
             <ToggleRow label="Esconder Saldos" icon="fa-eye-slash" iconColor="bg-blue-500" active={userProfile.hideBalance} onToggle={() => setUserProfile(p => ({ ...p, hideBalance: !p.hideBalance }))} isDarkMode={userProfile.isDarkMode} />
          </div>
        </div>

        {/* Data & Session */}
        <div className={`p-6 border-t ${userProfile.isDarkMode ? 'border-[#2A2E33]' : 'border-gray-50'}`}>
          <h3 className={`text-xs font-black uppercase tracking-widest mb-4 px-2 ${userProfile.isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Sessão e Dados</h3>
          <div className="space-y-3">
            <button onClick={exportToCSV} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold ${userProfile.isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <i className="fa-solid fa-file-export"></i> Exportar Dados (CSV)
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold bg-red-50 text-red-600">
              <i className="fa-solid fa-right-from-bracket"></i> Terminar Sessão
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editingField && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center px-6 pb-12">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className={`w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl ${userProfile.isDarkMode ? 'bg-[#1C1F23]' : 'bg-white'}`}>
              <h4 className={`text-xl font-black mb-6 ${userProfile.isDarkMode ? 'text-white' : 'text-gray-800'}`}>Editar {editingField}</h4>
              <input autoFocus defaultValue={userProfile[editingField as keyof UserProfile] as string} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  setUserProfile(p => ({ ...p, [editingField]: editingField === 'age' ? parseInt(val) : val }));
                  setEditingField(null);
                }
              }} className={`w-full border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-blue-500 mb-6 transition-colors ${userProfile.isDarkMode ? 'bg-[#2A2E33] text-white' : 'bg-gray-50 text-gray-800'}`} />
              <div className="flex gap-4">
                <button onClick={() => setEditingField(null)} className={`flex-1 py-4 rounded-2xl font-bold ${userProfile.isDarkMode ? 'bg-[#2A2E33] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>Cancelar</button>
                <button onClick={() => setEditingField(null)} className="flex-1 bg-blue-600 py-4 rounded-2xl font-bold text-white shadow-lg">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToggleRow: React.FC<{ label: string; icon: string; iconColor: string; active: boolean; onToggle: () => void; isDarkMode: boolean }> = ({ label, icon, iconColor, active, onToggle, isDarkMode }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2E33]/30' : 'bg-gray-50'}`}>
    <div className="flex items-center gap-3">
       <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs ${iconColor}`}><i className={`fa-solid ${icon}`}></i></div>
       <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
    </div>
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-blue-600' : (isDarkMode ? 'bg-[#2A2E33]' : 'bg-gray-200')}`}>
      <motion.div animate={{ x: active ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full" />
    </button>
  </div>
);

const SettingRow: React.FC<{ label: string; value: string; onEdit: () => void; isDarkMode: boolean }> = ({ label, value, onEdit, isDarkMode }) => (
  <button onClick={onEdit} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-[#2A2E33]' : 'hover:bg-gray-50'}`}>
    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>{label}</span>
    <span className={`text-sm font-black ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</span>
  </button>
);

export default SettingsView;
