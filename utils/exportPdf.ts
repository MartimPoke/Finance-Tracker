
import { Transaction, Category, TransactionType, UserProfile } from '../types';

interface ExportOptions {
  monthName: string;
  year: number;
  userProfile: UserProfile;
  categories: Category[];
}

export const exportTransactionsToPdf = (transactions: Transaction[], options: ExportOptions) => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const { monthName, year, userProfile, categories } = options;
  const dateStr = new Date().toLocaleDateString('pt-PT');

  // --- CONFIGURAÇÃO DE ESTILOS ---
  const PRIMARY_COLOR = [0, 117, 235]; // #0075EB
  const TEXT_DARK = [25, 28, 31];
  const TEXT_GRAY = [100, 100, 100];

  // --- CABEÇALHO ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text("FinTrack", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text("EXTRATO DE MOVIMENTOS", 14, 26);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
  doc.text(`Período: ${monthName} de ${year}`, 14, 32);
  doc.text(`Emitido em: ${dateStr}`, 14, 37);
  
  doc.text(`Utilizador: ${userProfile.name}`, 140, 26);
  doc.text(`Profissão: ${userProfile.job}`, 140, 31);

  // --- RESUMO FINANCEIRO ---
  const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  doc.setDrawColor(230, 230, 230);
  doc.line(14, 45, 196, 45); // Linha separadora

  // Box de Resumo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
  doc.text("RESUMO FINANCEIRO", 14, 52);

  doc.setFontSize(11);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  
  doc.text("Total Receitas:", 14, 60);
  doc.setTextColor(34, 197, 94); // Verde
  doc.text(`+${income.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €`, 50, 60);

  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text("Total Despesas:", 14, 67);
  doc.setTextColor(239, 68, 68); // Vermelho
  doc.text(`-${expenses.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €`, 50, 67);

  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text("Saldo Líquido:", 120, 63);
  doc.setFontSize(14);
  doc.setTextColor(balance >= 0 ? PRIMARY_COLOR[0] : 239, balance >= 0 ? PRIMARY_COLOR[1] : 68, balance >= 0 ? PRIMARY_COLOR[2] : 68);
  doc.text(`${balance.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €`, 150, 63);

  // --- TABELA DE MOVIMENTOS ---
  const tableData = transactions.map(t => {
    const cat = categories.find(c => c.id === t.categoryId);
    return [
      new Date(t.date).toLocaleDateString('pt-PT'),
      t.description,
      cat?.name || 'Geral',
      t.type === TransactionType.INCOME ? 'Receita' : 'Despesa',
      t.method,
      { 
        content: `${t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €`,
        styles: { halign: 'right', fontStyle: t.type === TransactionType.INCOME ? 'bold' : 'normal' }
      }
    ];
  });

  (doc as any).autoTable({
    startY: 75,
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Método', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: PRIMARY_COLOR, 
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: { 
      fontSize: 8,
      textColor: TEXT_DARK 
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 }
    },
    margin: { top: 20, bottom: 20 },
    didDrawPage: (data: any) => {
      // Rodapé
      const str = "Página " + doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      doc.text("Gerado automaticamente pelo FinTrack - O seu gestor financeiro pessoal", 120, doc.internal.pageSize.height - 10);
    }
  });

  const fileName = `Finance-Tracker_Extrato_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
