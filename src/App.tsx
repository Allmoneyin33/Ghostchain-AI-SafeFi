import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import { Wallet, LayoutDashboard, MessageSquare, History, Settings, LogOut, Bell, Search, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Mock initial data
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly paycheck' },
  { id: '2', date: '2026-04-02', amount: 1200, category: 'Rent', type: 'expense', description: 'Apartment rent' },
  { id: '3', date: '2026-04-03', amount: 150, category: 'Food', type: 'expense', description: 'Grocery shopping' },
  { id: '4', date: '2026-04-04', amount: 80, category: 'Transport', type: 'expense', description: 'Fuel' },
  { id: '5', date: '2026-04-05', amount: 300, category: 'Freelance', type: 'income', description: 'Logo design project' },
];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'history'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-gray-100 flex flex-col z-40 relative"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
            <Wallet size={24} />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight"
            >
              LiquidAgent
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<MessageSquare size={20} />} 
            label="AI Strategist" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<History size={20} />} 
            label="History" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-gray-50 space-y-2">
          <SidebarItem icon={<Settings size={20} />} label="Settings" collapsed={!isSidebarOpen} />
          <SidebarItem icon={<LogOut size={20} />} label="Logout" collapsed={!isSidebarOpen} />
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-white border border-gray-100 rounded-full p-1 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Menu size={12} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl w-96 border border-gray-100">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search transactions, insights..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">Hackathon User</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Pro Strategist</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {activeTab === 'dashboard' ? 'Financial Overview' : activeTab === 'chat' ? 'LiquidAgent AI' : 'Transaction History'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === 'dashboard' ? 'Real-time analysis of your cash flow and liquidity.' : 'Strategic advice powered by Gemini 3 Flash.'}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Export CSV</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">Generate Report</button>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <Dashboard transactions={transactions} />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
                    </div>
                    <div className="h-[500px]">
                      <Chat transactions={transactions} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-[calc(100vh-280px)]"
                >
                  <Chat transactions={transactions} />
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TransactionList transactions={transactions} onDelete={deleteTransaction} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AddTransaction onAdd={addTransaction} />
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, collapsed?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-blue-50 text-blue-600 font-bold' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="shrink-0">{icon}</div>
      {!collapsed && <span className="text-sm">{label}</span>}
      {active && !collapsed && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
    </button>
  );
}
