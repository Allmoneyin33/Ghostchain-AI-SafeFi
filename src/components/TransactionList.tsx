import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 30 Days</span>
      </div>
      <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {sorted.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic text-sm">
              No transactions yet. Start by adding one!
            </div>
          ) : (
            sorted.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.category}</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {t.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </p>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
