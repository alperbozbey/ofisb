import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Banknote,
  Activity
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const yearlyData: any[] = [];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Özet</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Son 30 Gün
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Yeni Fatura Oluştur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Günlük Kasa" 
          amount="₺0,00" 
          trend="0%" 
          isPositive={true} 
          icon={Banknote} 
          color="text-emerald-600"
          bgColor="bg-emerald-100"
          subtitle="düne göre"
        />
        <StatCard 
          title="Haftalık Kasa" 
          amount="₺0,00" 
          trend="0%" 
          isPositive={true} 
          icon={Wallet} 
          color="text-blue-600"
          bgColor="bg-blue-100"
          subtitle="geçen haftaya göre"
        />
        <StatCard 
          title="Aylık Kasa" 
          amount="₺0,00" 
          trend="0%" 
          isPositive={true} 
          icon={TrendingUp} 
          color="text-indigo-600"
          bgColor="bg-indigo-100"
          subtitle="geçen aya göre"
        />
        <StatCard 
          title="Günlük Net Kar" 
          amount="₺0,00" 
          trend="0%" 
          isPositive={true} 
          icon={Activity} 
          color="text-emerald-600"
          bgColor="bg-emerald-100"
          subtitle="düne göre"
        />
        <StatCard 
          title="Haftalık Net Kar" 
          amount="₺0,00" 
          trend="0%" 
          isPositive={false} 
          icon={TrendingDown} 
          color="text-red-600"
          bgColor="bg-red-100"
          subtitle="geçen haftaya göre"
        />
        <StatCard 
          title="Aylık Net Kar" 
          amount="₺0,00" 
          trend="0%" 
          isPositive={true} 
          icon={Activity} 
          color="text-indigo-600"
          bgColor="bg-indigo-100"
          subtitle="geçen aya göre"
        />
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">12 Aylık Karşılaştırmalı Finansal Özet</h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, '']}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="gelir" name="Gelir" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="gider" name="Gider" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line type="monotone" dataKey="kar" name="Net Kar" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Son İşlemler</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Tümü</button>
          </div>
          
          <div className="space-y-4">
            {[]}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, amount, trend, isPositive, icon: Icon, color, bgColor, subtitle = "geçen aya göre" }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor} ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{amount}</span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-sm">
        {isPositive !== null && (
          <span className={isPositive ? 'text-emerald-600' : 'text-red-600'}>
            {trend}
          </span>
        )}
        {isPositive === null && (
          <span className="text-amber-600 font-medium">{trend}</span>
        )}
        <span className="text-slate-500">{subtitle}</span>
      </div>
    </div>
  );
}
