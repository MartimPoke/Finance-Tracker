
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  onLogin: (username: string, password?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUserExists = (user: string) => {
    return localStorage.getItem(`fintrack_data_${user.toLowerCase().trim()}`) !== null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanUsername = username.toLowerCase().trim();

    if (!cleanUsername) {
      setError("Por favor, introduza um nome de utilizador.");
      return;
    }

    if (isRegistering) {
      if (checkUserExists(cleanUsername)) {
        setError("Este nome de utilizador já está em uso.");
        return;
      }
      if (password.length < 4) {
        setError("A palavra-passe deve ter pelo menos 4 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setError("As palavras-passe não coincidem.");
        return;
      }
    } else {
      if (!checkUserExists(cleanUsername)) {
        setError("Utilizador não encontrado. Por favor, crie uma conta primeiro.");
        return;
      }
    }

    onLogin(cleanUsername, password);
  };

  return (
    <div className="min-h-screen bg-white text-[#191C1F] flex flex-col items-center justify-center px-6 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-400 rounded-full blur-[120px] opacity-20"></div>

      <div className="relative z-10 w-full max-w-sm text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="w-16 h-16 bg-[#0075EB] rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-200 mx-auto mb-6">
            <i className="fa-solid fa-vault"></i>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">FinTrack</h1>
          <p className="text-gray-400 font-bold">Domine as suas finanças com simplicidade.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isRegistering ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black mb-6">Entrar</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Username</label>
                    <input
                      type="text"
                      placeholder="ex: joao123"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Palavra-passe</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  
                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black uppercase tracking-tight text-center bg-red-50 py-2 rounded-xl border border-red-100">
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#0075EB] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 transition-transform active:scale-95 mt-2"
                  >
                    Aceder à conta
                  </button>
                </form>
              </div>
              <p className="text-sm font-bold text-gray-400">
                Ainda não tem conta?{' '}
                <button onClick={() => { setIsRegistering(true); setError(null); setPassword(''); }} className="text-blue-600">Criar agora</button>
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="register"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black mb-6">Criar Conta</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Username</label>
                    <input
                      type="text"
                      placeholder="ex: joao123"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Escolha Palavra-passe</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Confirmar Palavra-passe</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black uppercase tracking-tight text-center bg-red-50 py-2 rounded-xl border border-red-100">
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#191C1F] text-white py-4 rounded-2xl font-black shadow-lg transition-transform active:scale-95 mt-2"
                  >
                    Confirmar Registo
                  </button>
                </form>
              </div>
              <button onClick={() => { setIsRegistering(false); setError(null); }} className="text-sm font-bold text-gray-400">
                <i className="fa-solid fa-arrow-left mr-2"></i> Voltar ao login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 grid grid-cols-3 gap-4 opacity-50">
          <Feature icon="fa-chart-pie" label="Insights" />
          <Feature icon="fa-shield-heart" label="Seguro" />
          <Feature icon="fa-cloud" label="Cloud-sync" />
        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
      <i className={`fa-solid ${icon} text-xs`}></i>
    </div>
    <span className="text-[10px] font-black uppercase text-gray-400 tracking-tight">{label}</span>
  </div>
);

export default LandingPage;
