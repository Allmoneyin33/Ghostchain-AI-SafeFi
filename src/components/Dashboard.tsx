import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie 
} from 'recharts';
import { Transaction, CashFlowStats } from '../types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { generateFinancialAdvice } from '../lib/gemini';

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const stats: CashFlowStats = transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.totalIncome += t.amount;
    else acc.totalExpenses += t.amount;
    acc.netCashFlow = acc.totalIncome - acc.totalExpenses;
    return acc;
  }, { totalIncome: 0, totalExpenses: 0, netCashFlow: 0 });

  useEffect(() => {
    const fetchInsight = async () => {
      setIsInsightLoading(true);
      try {
        const res = await generateFinancialAdvice(transactions, "Give me a 1-sentence strategic insight based on my current cash flow.", []);
        setInsight(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsInsightLoading(false);
      }
    };
    fetchInsight();
  }, [transactions.length]); // Refresh insight when transactions change

  // Prepare chart data
  const chartData = transactions.reduce((acc: any[], t) => {
    const existing = acc.find(d => d.date === t.date);
    if (existing) {
      if (t.type === 'income') existing.income += t.amount;
      else existing.expense += t.amount;
    } else {
      acc.push({ date: t.date, income: t.type === 'income' ? t.amount : 0, expense: t.type === 'expense' ? t.amount : 0 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(c => c.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Insight Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg shadow-blue-100 flex items-center gap-4"
      >
        <div className="p-2 bg-white/20 rounded-xl shrink-0">
          <Sparkles size={20} className="text-blue-100" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-0.5">LiquidAgent Insight</p>
          {isInsightLoading ? (
            <div className="flex items-center gap-2 text-sm text-blue-50/80 italic">
              <Loader2 size={14} className="animate-spin" /> Analyzing flow...
            </div>
          ) : (
            <p className="text-sm font-medium leading-tight">{insight || "Add more data for a personalized strategic insight."}</p>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
              <ArrowUpRight size={20} />
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">Income</span>
          </div>
          <h4 className="text-gray-500 text-xs font-medium mb-1">Total Inflow</h4>
          <p className="text-2xl font-bold text-gray-900">${stats.totalIncome.toLocaleString()}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <ArrowDownLeft size={20} />
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider">Expenses</span>
          </div>
          <h4 className="text-gray-500 text-xs font-medium mb-1">Total Outflow</h4>
          <p className="text-2xl font-bold text-gray-900">${stats.totalExpenses.toLocaleString()}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200 text-white"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 text-white rounded-xl">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2 py-1 rounded-full uppercase tracking-wider">Net Flow</span>
          </div>
          <h4 className="text-white/70 text-xs font-medium mb-1">Available Liquidity</h4>
          <p className="text-2xl font-bold">${stats.netCashFlow.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Cash Flow History</h3>
            <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1 text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-600" /> Income</span>
              <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 rounded-full bg-red-500" /> Expense</span>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Expense Distribution</h3>
          <div className="h-[250px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-2">
              {categoryData.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600">{c.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">${c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
