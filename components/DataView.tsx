
import React from 'react';
import { Transaction } from '../types';

interface DataViewProps {
  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
}

const DataView: React.FC<DataViewProps> = ({ transactions, setTransactions }) => {
  const exportToCSV = () => {
    const headers = ['ID', 'Data', 'Descrição', 'Valor', 'Tipo', 'Método', 'Recorrente'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.description,
      t.amount,
      t.type,
      t.method,
      t.isRecurring ? 'Sim' : 'Não'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fintrack_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearData = () => {
    if (confirm('Tem a certeza que deseja apagar TODOS os seus dados? Esta ação é irreversível.')) {
      setTransactions([]);
      localStorage.removeItem('fintrack_transactions_v2');
      localStorage.removeItem('fintrack_categories_v2');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Exportar & Backup</h3>
        <p className="text-gray-500 mb-6">Mantenha os seus dados seguros ou leve-os para uma análise externa detalhada em Excel ou Google Sheets.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-3 bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-100 transition-all"
          >
            <i className="fa-solid fa-file-export"></i>
            Exportar para CSV
          </button>
          
          <button 
            onClick={clearData}
            className="flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all"
          >
            <i className="fa-solid fa-trash-can"></i>
            Apagar Tudo
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Estrutura e Conceitos</h3>
        <div className="space-y-6">
          <section>
            <h4 className="font-bold text-gray-800 mb-2">Base de Dados (Entidades)</h4>
            <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm overflow-x-auto">
              <p className="mb-1"><span className="text-indigo-600">Transactions:</span> [id, amount, type, categoryId, date, method, description, isRecurring]</p>
              <p><span className="text-indigo-600">Categories:</span> [id, name, icon, color, group, budget]</p>
            </div>
          </section>

          <section>
            <h4 className="font-bold text-gray-800 mb-2">User Stories Principais</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
              <li>Como utilizador, quero registar despesas rapidamente para não perder o controlo do meu fluxo de caixa.</li>
              <li>Como utilizador, quero visualizar a minha taxa de poupança mensal para monitorizar os meus objetivos financeiros.</li>
              <li>Como utilizador, quero receber alertas quando exceder 80% do meu orçamento numa categoria.</li>
              <li>Como utilizador, quero analisar os meus gastos pela regra 50/30/20 para garantir saúde financeira a longo prazo.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataView;
