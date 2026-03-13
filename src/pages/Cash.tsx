import React, { useState } from 'react';
import { Plus, Wallet, Building, CreditCard, MoreHorizontal, ArrowRightLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Cash() {
  const { accounts } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Kasa & Banka</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <ArrowRightLeft size={16} />
            Virman / Transfer
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} />
            Yeni Hesap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow group relative">
            <div className="absolute top-6 right-6">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                account.type === 'cash' ? 'bg-emerald-100 text-emerald-600' : 
                account.type === 'bank' ? 'bg-blue-100 text-blue-600' : 
                'bg-purple-100 text-purple-600'
              }`}>
                {account.type === 'cash' && <Wallet size={24} />}
                {account.type === 'bank' && <Building size={24} />}
                {account.type === 'credit' && <CreditCard size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-1 pr-6">
                  {account.name}
                </h3>
                <span className="text-sm text-slate-500">
                  {account.type === 'cash' ? 'Nakit Kasa' : account.type === 'bank' ? 'Banka Hesabı' : 'Kredi Kartı'}
                </span>
              </div>
            </div>

            {account.type !== 'cash' && (
              <div className="space-y-2 mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Banka:</span>
                  <span className="font-medium text-slate-900">{account.bank}</span>
                </div>
                {account.branch && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Şube:</span>
                    <span className="font-medium text-slate-900">{account.branch}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{account.type === 'credit' ? 'Kart No:' : 'IBAN:'}</span>
                  <span className="font-medium text-slate-900 font-mono text-xs mt-0.5">{account.iban}</span>
                </div>
              </div>
            )}

            <div className={`pt-4 border-t border-slate-100 flex items-center justify-between ${account.type === 'cash' ? 'mt-12' : ''}`}>
              <span className="text-sm text-slate-500">Güncel Bakiye</span>
              <span className={`text-2xl font-bold ${
                account.balance < 0 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {account.currency === 'TRY' ? '₺' : account.currency === 'USD' ? '$' : '€'}
                {Math.abs(account.balance).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Account Card */}
        <button className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 shadow-sm p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center min-h-[250px] group">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-4">
            <Plus size={24} />
          </div>
          <h3 className="text-base font-medium text-slate-600 group-hover:text-blue-700">Yeni Hesap Ekle</h3>
          <p className="text-sm text-slate-400 mt-1 text-center">Kasa, banka veya kredi kartı hesabı oluşturun</p>
        </button>
      </div>
    </div>
  );
}
