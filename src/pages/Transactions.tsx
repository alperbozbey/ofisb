import React, { useState } from 'react';
import { Plus, Filter, Download, MoreHorizontal, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

const transactions: any[] = [];

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gelir & Gider</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} />
            Gelir Ekle
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} />
            Gider Ekle
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('all')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
                activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Tüm İşlemler
            </button>
            <button 
              onClick={() => setActiveTab('in')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors flex items-center gap-1 ${
                activeTab === 'in' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowUpRight size={16} />
              Gelirler
            </button>
            <button 
              onClick={() => setActiveTab('out')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors flex items-center gap-1 ${
                activeTab === 'out' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowDownRight size={16} />
              Giderler
            </button>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="İşlem ara..." 
                className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-48"
              />
            </div>
            <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
              <Filter size={16} />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Tarih</th>
                <th className="px-6 py-4 font-medium">Açıklama</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Hesap</th>
                <th className="px-6 py-4 font-medium text-right">Tutar</th>
                <th className="px-6 py-4 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions
                .filter(t => activeTab === 'all' || t.type === activeTab)
                .map((trx, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {trx.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        trx.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {trx.type === 'in' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                      <span className="truncate max-w-[200px]" title={trx.description}>{trx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {trx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {trx.account}
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${
                    trx.type === 'in' ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {trx.type === 'in' ? '+' : '-'}{trx.amount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Dummy) */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-sm text-slate-500">Toplam {transactions.filter(t => activeTab === 'all' || t.type === activeTab).length} işlem gösteriliyor</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-white disabled:opacity-50" disabled>Önceki</button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-600 rounded text-sm text-white">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-white">Sonraki</button>
          </div>
        </div>
      </div>
    </div>
  );
}
